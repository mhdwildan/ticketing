import Link from 'next/link';

/**
 * param currentUser (data auth)
 * param ticket (dari getInitialProp dibawah)
 */
const LandingPage = ({ currentUser, tickets }) => {
  //map data ticket dan masukkan ke format table
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

/**
 * Buat initial props dan masukkan props dari parent compoment _app.js
 * param context (props milik child component)
 * param client (koneksi browser ke container docker service)
 * param currentUser (data user auth)
 */
LandingPage.getInitialProps = async (context, client, currentUser) => {
  //ambil data dari ticket service
  const { data } = await client.get('/api/tickets');
  //retur data hasil dan rtur ke komponen Landing Page
  return { tickets: data };
};

export default LandingPage;
