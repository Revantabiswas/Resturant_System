export default function handler(req, res) {
  if (req.method === 'POST') {
    // In a real app, you would save this data to a database
    const reservationData = req.body;
    console.log('Reservation received:', reservationData);
    
    // For development purposes, just return success
    res.status(200).json({ 
      message: 'Reservation received successfully!',
      reservation: reservationData
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
