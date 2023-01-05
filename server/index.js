const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "044b7c299162323694f13501f9132172ddd356120a22a991230f49c1bf37704c9326cd1b859413679559d26d8d2c7a5d7461fe0c82e994ccad50b4c36fcfd671c0": 100,
  "04f7670e86f323ca80be9d734ed18c90b74c2082c2f2def520b700c8f5b7f039c2140b7998537d9324d3baefc8c75552d1234df5374e8a109bf0175af2100e95ce": 50,
  "04aacd7723b12dde44aeef8b682121aa60a6da2f75288255d9d18e2a0d4b411deb4142d0cd173e002645f27ec9abf3ff5f543c9b4fcfbf1a71707a3bddd107ae2d": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
