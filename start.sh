while (true) 
do
    echo "Registering commands..."
    node deploy-commands.js
    echo "Starting bot..."
    node main.js
    echo "Bot restarting in 10s..."
    echo "Press [CTRL+C] to stop."
    sleep 10
    echo "Restarting bot..."
done
