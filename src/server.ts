import app from "./app.ts";
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const PORT = process.env.PORT || 3000;

app.listen(PORT , () => {
    console.log(`TBK Services listenin on PORT : ${PORT}`);
})