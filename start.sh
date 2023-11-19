while (true) 
do
    echo "Registering commands..."
    node deploy-commands.js
    echo "Starting bot..."
    node main.js
    echo "Bot restarting in 3s..."
    echo "Press [CTRL+C] to stop."
    sleep 3
    echo "Restarting bot..."
done
