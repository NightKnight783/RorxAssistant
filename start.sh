while (true) 
do
    echo "Registering commands..."
    npm run deploy
    echo "Starting bot..."
    npm run start
    echo "Bot restarting in 3s..."
    echo "Press [CTRL+C] to stop."
    sleep 3
    echo "Restarting bot..."
done
