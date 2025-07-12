#!/usr/bin/env python3

from app import create_app

if __name__ == '__main__':
    app = create_app()
    print("Starting Flask server on http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True) 