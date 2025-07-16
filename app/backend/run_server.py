#!/usr/bin/env python3

from app import create_app
import os

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 8000))
    print(f"Starting Flask server on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=True) 