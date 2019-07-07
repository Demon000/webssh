webssh
============

1. Copy `config/example.json` to `config/default.json` and configure the needed fields.
2. Run `npm install` to install the dependencies.
3. Run `npm run link` to make packages available client-side.
4. Run `npm run start` for production or `npm run start-dev` for development.

starting at boot with systemd
============
Create the following file at `/etc/systemd/system/webssh.service`.
```
[Service]
WorkingDirectory=/path/to/webssh
ExecStart=/usr/bin/npm start
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=propanel
User=root
Group=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```
