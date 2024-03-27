const express = require('express');
const uuid = require('uuid');

const port = 3000;

const app = express();
app.use(express.json());

const orders = [];

app.post('/order', (request, response) => {
	const { order, nomeCliente, pricePedido } = request.body;

	if (!order || !nomeCliente || !pricePedido) {
		return response
			.status(400)
			.json({ error: 'Falta de informações no corpo da requisição.' });
	}

	const id = uuid.v4();

	orders.push({
		id,
		order,
		nomeCliente,
		pricePedido,
		status: 'Em preparação',
	});

	response.status(201).json({
		id,
		order,
		nomeCliente,
		pricePedido,
		status: 'Em preparação',
	});
});

app.get('/order', (request, response) => {
	response.json(orders);
});

app.put('/order/:id', (request, response) => {
	const orderId = request.params.id;
	const { order, nomeCliente, pricePedido, status } = request.body;
	const orderIndex = orders.findIndex((order) => order.id === orderId);

	if (orderIndex < 0) {
		return response.status(404).json({ error: 'pedido não encontrado' });
	}

	if (order) {
		orders[orderIndex].order = order;
	}
	if (nomeCliente) {
		orders[orderIndex].nomeCliente = nomeCliente;
	}
	if (pricePedido) {
		orders[orderIndex].pricePedido = pricePedido;
	}
	if (status) {
		orders[orderIndex].status = status;
	}

	response.json(orders[orderIndex]);
});

app.delete('/order/:id', (request, response) => {
	const orderId = request.params.id;

	const orderIndex = orders.findIndex((order) => order.id === orderId);

	if (orderIndex === -1) {
		return response.status(404).json({ error: 'Pedido não encontrado.' });
	}

	orders.splice(orderIndex, 1);

	return response.status(204).json();
});

app.get('/order/:id', (request, response) => {
	const orderId = request.params.id;
	const orderIndex = orders.findIndex((order) => order.id === orderId);
	if (orderIndex === -1) {
		return response.status(404).json({ error: 'Pedido não encontrado.' });
	}

	response.json(orders);
});

app.patch('/order/:id', (request, response) => {
	const orderId = request.params.id;
	const orderIndex = orders.findIndex((order) => order.id === orderId);

	if (orderIndex !== -1) {
		orders[orderIndex].status = 'pronto';
		response
			.status(201)
			.json({ Message: 'Pedido Alterado status para pronto' });
	} else {
		response.status(404).json({ Message: 'Pedido Não encontrado' });
	}

	response.json(orders);
});

app.listen(port, () => {
	console.log(`🚀 Server started on port ${port}`);
});
