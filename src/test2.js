(
echo const express = require('express'^);
echo const app = express(^);
echo const PORT = 3000;
echo app.get('/', (req, res^) =^> res.send('OK'^)^);
echo app.listen(PORT, (^) =^> console.log('✅ ТЕСТОВЫЙ СЕРВЕР ЗАПУЩЕН НА 3000'^)^);
) > test2.js