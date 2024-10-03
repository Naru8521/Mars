const mc = require('minecraft-protocol');

// サーバーの作成
const server = mc.createServer({
    'online-mode': false, // オンラインモードを無効にする
    host: '0.0.0.0',      // サーバーのホスト（すべてのインターフェースで待ち受け）
    port: 25565,          // ポート番号
    version: '1.21.30'    // Minecraftのバージョン
});

// クライアントがサーバーにログインしたときのイベント
server.on('login', (client) => {
    console.log(`${client.username} has logged in`);

    // クライアントから送られるすべてのパケットをリッスン
    client.on('packet', (data, packetMeta) => {
        console.log(`Received packet from client: ${packetMeta.name}`);
        console.log(data);  // クライアントからのパケットデータを表示
    });

    // サーバーからクライアントにパケットを送信
    client.write('chat', { message: 'Welcome to the server!' });
});


// -------

const mineflayer = require('mineflayer');

// Botの作成
const bot = mineflayer.createBot({
    host: 'localhost',    // 接続するサーバーのホスト
    port: 25565,          // 接続するサーバーのポート
    username: 'Bot',      // Botのユーザー名
    version: '1.21.30'    // Minecraftのバージョン
});

// サーバーから送信されるすべてのパケットをリッスン
bot._client.on('packet', (data, packetMeta) => {
    console.log(`Received packet from server: ${packetMeta.name}`);
    console.log(data);  // サーバーからのパケットデータを表示
});

// Botがサーバーにログインしたときのイベント
bot.once('login', () => {
    console.log('Bot has logged in and is listening for packets!');
});

// Botからサーバーにパケットを送信（例としてチャットメッセージを送信）
bot.once('spawn', () => {
    bot.chat('Hello, server! This is a test message.');
});
