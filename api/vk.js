export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  let body = req.body;

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).send("Bad Request");
    }
  }

  const CONFIRMATION_CODE = "4d476332";
  const VK_SECRET = "kP7sY9q3Wm2Zf8R1tL4vB6nC0xD5gH7jK9pM2rT8";

  const { type, secret, object } = body || {};

  // проверка секретного ключа
  if (secret && secret !== VK_SECRET) {
    return res.status(403).send("forbidden");
  }

  // шаг 1: подтверждение сервера
  if (type === "confirmation") {
    res.status(200).setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.send(CONFIRMATION_CODE);
  }

  // шаг 2: логируем все события, которые присылает VK
  console.log("VK EVENT:", JSON.stringify(body, null, 2));

  // пример: если пришло новое сообщение
  if (type === "message_new") {
    // структура: { object: { message, client_info } }
    // см. доку VK [web:106][web:111]
    const msg = object?.message;
    const fromId = msg?.from_id;
    const text = msg?.text;

    console.log("NEW MESSAGE FROM VK:", { fromId, text });
    // тут можно будет дальше обрабатывать/отвечать
  }

  // VK ждёт ответ "ok" на все события, кроме confirmation
  res.status(200).setHeader("Content-Type", "text/plain; charset=utf-8");
  return res.send("ok");
}
