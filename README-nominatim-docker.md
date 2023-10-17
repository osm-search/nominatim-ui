# Adding nominatim-ui to a nominatim-docker container

This document assumes you followed the [nominatim-docker](https://github.com/mediagis/nominatim-docker/) instructions.

nominatim-ui is a separate project and it's not planned to add the UI to the nominatim-docker installation.

The following instructions might still be useful and/or help futher automate such an installation.

```bash
# Log into the running container
docker exec -it nominatim /bin/bash

# Download stable nominatim-ui release
# available verions: https://github.com/osm-search/nominatim-ui/releases
VERSION=3.4.0
cd /tmp
curl -L --fail -o nominatim-ui.tar.gz https://github.com/osm-search/nominatim-ui/releases/download/v${VERSION}/nominatim-ui-${VERSION}.tar.gz
tar -xzf nominatim-ui.tar.gz && rm nominatim-ui.tar.gz
mv nominatim-ui-$VERSION nominatim-ui

# Set the configuration. In this case the UI website should access the API
# from the same host and port
tee nominatim-ui/dist/theme/config.theme.js << 'EOF'
Nominatim_Config.Nominatim_API_Endpoint = '/';
EOF

# Apache configuration has an entry 'DirectoryIndex search.php'. To make
# /ui work we just create such a file. Alternatively change the entry for
# /ui directory. 
# Apache configuration is in /etc/apache2/sites-enabled/000-default.conf
cd nominatim-ui/dist/ && ln -s index.html search.php && cd -

# Move files to Apache webserver directory
mkdir /nominatim/website/ui
mv nominatim-ui/dist/* /nominatim/website/ui/
rm -r nominatim-ui
chown -R nominatim:nominatim /nominatim/website/ui/
```

If the API runs on http://some-host.example.org:8080/ then http://some-host.example.org:8080/ui
will now display a website including map and search box.