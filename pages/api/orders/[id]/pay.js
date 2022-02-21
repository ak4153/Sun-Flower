import nc from 'next-connect';
import { Order } from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import { Product } from '../../../../models/Product';
//middleware incase of an error
const handler = nc({ onError });
handler.use(isAuth);
//[id] file name this one acts as /api/products/:productId
handler.put(async (req, res) => {
  //TODO > LOGIC FOR REMOVING STOCK
  //* UPDATE PAYED STATUS
  const { details, orderId } = req.body;

  if (details.status === 'COMPLETED') {
    await db.connect();
    await Order.updateOne(
      { _id: orderId },
      { isPaid: true, paidAt: details.update_time }
    );
    //this is the way to for updating mongo
    const foundOrder = await Order.findById(orderId);
    var paidOrder;
    if (foundOrder) {
      foundOrder.isPaid = true;
      foundOrder.paidAt = Date.now();
      foundOrder.paymentResult = {
        id: details.id,
        status: details.status,
        email_address: details.email_address,
      };
      paidOrder = await foundOrder.save();

      foundOrder.orderItems.map(async (item) => {
        const foundProduct = await Product.findById(item._id);
        foundProduct.countInStock -= item.quantity;
        await foundProduct.save();
        return item;
      });
      await db.disconnect();
      return res
        .status(202)
        .send({ message: 'Order successfuly paid', paidOrder: paidOrder });
    } else {
      await db.disconnect();
      return res.status(404).send({ message: 'order not found' });
    }
  } else {
    await db.disconnect();
    return res.status(401).send({ message: 'An error occured with payment' });
  }
});

export default handler;

//PAYPAL RES.DATA
/*
{
  details: {
    id: '8H2344098Y904631A',
    intent: 'CAPTURE',
    status: 'COMPLETED',
    purchase_units: [ [Object] ],
    payer: {
      name: [Object],
      email_address: 'sb-f1xm4714031483@personal.example.com',
      payer_id: 'B6LC5V5RJKKRU',
      address: [Object]
    },
    create_time: '2022-02-21T08:56:51Z',
    update_time: '2022-02-21T08:57:04Z',
    links: [ [Object] ]
  },
  orderId: '62129772bdbc770342b1bbc9'
}
*/
