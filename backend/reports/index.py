"""Получение и создание репортов на игроков Brush SMP"""
import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

VIOLATION_EMOJI = {
    'Гриферство':              '💣',
    'Читы / хаки':             '⚡',
    'Оскорбления':             '💬',
    'Воровство':               '🗝️',
    'Тим с читером (софт)':    '🤝',
    'X-Ray / Block ESP':       '👁️',
    'Оскорбление администрации':'🛡️',
    'Оскорбление родителей':   '🤬',
    'Другое':                  '🔧',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        author = params.get('author', '').strip()

        conn = get_conn()
        cur = conn.cursor()

        if author:
            cur.execute(
                "SELECT id, author_nick, target_nick, violation_type, description, status, created_at "
                "FROM reports WHERE LOWER(author_nick) = LOWER(%s) ORDER BY created_at DESC",
                (author,)
            )
        else:
            cur.execute(
                "SELECT id, author_nick, target_nick, violation_type, description, status, created_at "
                "FROM reports ORDER BY created_at DESC LIMIT 50"
            )

        rows = cur.fetchall()
        conn.close()

        reports = []
        for r in rows:
            vtype = r[3]
            reports.append({
                'id':        r[0],
                'author':    r[1],
                'target':    r[2],
                'reason':    vtype,
                'emoji':     VIOLATION_EMOJI.get(vtype, '🔧'),
                'description': r[4],
                'status':    r[5],
                'date':      r[6].strftime('%d.%m.%Y'),
                'hasProof':  False,
            })

        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'reports': reports}, ensure_ascii=False),
        }

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        author = body.get('author', '').strip()
        target = body.get('target', '').strip()
        vtype  = body.get('violation_type', '').strip()
        desc   = body.get('description', '').strip()

        if not author or not target or not vtype or not desc:
            return {
                'statusCode': 400,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Заполни все поля'}, ensure_ascii=False),
            }

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO reports (author_nick, target_nick, violation_type, description) "
            "VALUES (%s, %s, %s, %s) RETURNING id",
            (author, target, vtype, desc)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'id': new_id}, ensure_ascii=False),
        }

    return {'statusCode': 405, 'headers': CORS, 'body': 'Method Not Allowed'}
