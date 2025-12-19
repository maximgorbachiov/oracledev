- backend service api is: http://tarotbackapi.duckdns.org/
1. To setup VM should be followed the next public network guide (also to setup ssl certificate should ipv6 address be setup): https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/scenarioa.htm#Scenario_A_Public_Subnet
Then, to change dnf from internal Oracle to the public: 
    sudo sed -i 's|https://yum\$ociregion\.\$ocidomain|https://yum.oracle.com|' /etc/yum.repos.d/*.repo
    sudo dnf clean all
    sudo dnf update -y (potential issue 1)
2. To setup Nginx https://docs.oracle.com/en/learn/ol-nginx/#enable-and-start-the-nginx-service
3. Oracle Linux Firewall should also be setup
    Even if OCI allows it, Oracle Linux may still block it.

    Check with:

    sudo firewall-cmd --list-all
    If ports 80/443 are missing:

    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload

    Confirm Nginx is listening on all interfaces
    Run:

    sudo ss -tulnp | grep nginx
    You should see:

    LISTEN 0 511 *:80  *:*  users:(("nginx",pid=...,fd=...))
    If instead you see 127.0.0.1:80, it means Nginx is only listening locally — edit /etc/nginx/nginx.conf and set:

    listen 80;
    (not listen 127.0.0.1:80;)

    Test from outside
    From your laptop:

    curl -I http://130.61.207.17
    If that still times out, it’s almost always the VCN security list not allowing inbound HTTP.
4. etc -> systemd -> system -> tarotapp.service (systemctl service restart config)
5. etc -> nginx -> conf.d -> tarotapp.conf (nginx reverse proxy config)
6. var -> www -> tarotapp (application folder)
7. sudo setsebool -P httpd_can_network_connect 1 // this command MUST BE run to show linux that nginx could use port 5000
8. After github action setup your user for github action should be in the same group as nginx user on linux vm. See utils/1.txt
9. To setup SSL it will be better to ask ChatGPT and Claude

Potential issues:
1. Errors during downloading metadata for repository 'ol9_ksplice':
        - Status code: 404 for https://yum.oracle.com/repo/OracleLinux/OL9/ksplice/x86_64/repodata/repomd.xml (IP: 23.58.110.6)
        Error: Failed to download metadata for repo 'ol9_ksplice': Cannot download repomd.xml: Cannot download repodata/repomd.xml: All mirrors were tried

        I see what’s going on — the ol9_ksplice repo is causing the failure because Ksplice is not publicly available via yum.oracle.com for all users (it usually needs a support subscription).

        When you ran dnf update, it tried to reach:
        https://yum.oracle.com/repo/OracleLinux/OL9/ksplice/x86_64/repodata/repomd.xml
        but the server returned 404 Not Found.

        Two ways to fix this
        Option 1 — Disable the ol9_ksplice repo
        You can disable it permanently so dnf ignores it:

        sudo dnf config-manager --disable ol9_ksplice
        Or, disable just for one update run:

        sudo dnf update -y --disablerepo=ol9_ksplice
        Option 2 — Comment it out in the .repo file
        Open the file:

        sudo nano /etc/yum.repos.d/ksplice-ol9.repo
        Find lines starting with:

        [ol9_ksplice]
        enabled=1
        Change enabled=1 → enabled=0
        Save & exit.

    Better — clean up permanently
    Run this:

    sudo sed -i 's|https://yum\$ociregion\.\$ocidomain|https://yum.oracle.com|' /etc/yum.repos.d/*.repo
    sudo dnf config-manager --disable ol9_ksplice ol9_oci_included
    sudo dnf clean all
    sudo dnf update -y

Future goals:
1) Create backend service which implements next:
    1.1 - User management module (add, delete, update, get, get all, create admin user)
    1.2 - login, register module (user register by login/password and also by third party provider) with email verification
    1.3 - user's tarot main functions (get card of the day, get three cards, get history ...)
    1.4 - admin's tarot main functions (upload images, update description, create card of the day, create different tarot sets, ...)
    1.5 - background service which archive users history after 30 days
2) Store everything in one db (check for Postgres or Oracle DB)
3) Separate all the described above domains into different services and connect (what can be) them through the Kafka
4) Separate data by several db's perfectly one db by one service (use more appropriate db base on data and requirments)