const mongoose = require('mongoose');

module.exports = async () => {
    const mongoUrl = 'mongodb+srv://shadwar123:TxiJTYE00WXysSZ9@cluster0.yz6yzdu.mongodb.net/?retryWrites=true&w=majority'

    
    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

}
