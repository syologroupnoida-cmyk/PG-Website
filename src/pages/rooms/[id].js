
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const roomData = {
  1: {
    name: "Single Occupancy Room",
    price: 12000,
    sharing: "Private Room",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200",
    description:
      "Enjoy your own private space at Apna Aashiyana. This room is designed for students and working professionals who prefer privacy, comfort and a peaceful environment.",
    facilities: [
      "Private bed",
      "Wardrobe",
      "Study table",
      "Chair",
      "Wi-Fi access",
      "Housekeeping (as provided)",
      "Power backup (if available)",
    ],
    occupancy: "1 Person",
  },
  2: {
    name: "Double Sharing Room",
    price: 8000,
    sharing: "2 Person Sharing",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200",
    description:
      "A comfortable shared room with space for two residents. A suitable option for students and working professionals looking for affordable accommodation.",
    facilities: [
      "2 Beds",
      "Wardrobe / Storage",
      "Study area",
      "Wi-Fi access",
      "Housekeeping (as provided)",
      "Power backup (if available)",
    ],
    occupancy: "2 Persons",
  },
  3: {
    name: "Triple Sharing Room",
    price: 6500,
    sharing: "3 Person Sharing",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
    description:
      "An economical accommodation option with shared living space and essential facilities for everyday comfort.",
    facilities: [
      "3 Beds",
      "Shared Storage",
      "Study area",
      "Wi-Fi access",
      "Housekeeping (as provided)",
      "Power backup (if available)",
    ],
    occupancy: "3 Persons",
  },
};

export default function RoomDetails() {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady) return <p>Loading room...</p>;

  const room = roomData[id];

  if (!room) {
    return (
      <main style={{ padding: 50, textAlign: "center" }}>
        <h2>Room Not Found</h2>
        <Link href="/#rooms">Back to Rooms</Link>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{room.name} | Apna Aashiyana</title>
        <meta name="description" content={room.description} />
      </Head>

      <div className="details-page">
        <header className="details-header">
          <Link href="/" className="details-logo">
            Apna <strong>Aashiyana</strong>
          </Link>
          <Link href="/#rooms" className="back-link">
            ← Back to Rooms
          </Link>
        </header>

        <main className="details-container">
          <div className="details-breadcrumb">
            Home / Rooms / {room.name}
          </div>

          <div className="details-grid">
            <div className="details-left">
              <img
                className="details-main-image"
                src={room.image}
                alt={room.name}
              />

              <span className="details-label">{room.sharing}</span>

              <h1>{room.name}</h1>
              <p className="details-description">{room.description}</p>

              <div className="details-info">
                <div>
                  <span>👥</span>
                  <strong>{room.occupancy}</strong>
                  <small>Occupancy</small>
                </div>
                <div>
                  <span>🏠</span>
                  <strong>Noida</strong>
                  <small>Location</small>
                </div>
                <div>
                  <span>🛏️</span>
                  <strong>Furnished</strong>
                  <small>Room Type</small>
                </div>
              </div>

              <section className="details-facilities">
                <h2>Room Facilities</h2>
                <div className="details-facility-grid">
                  {room.facilities.map((item) => (
                    <div key={item}>✓ {item}</div>
                  ))}
                </div>
              </section>

              <section className="details-about">
                <h2>About This Room</h2>
                <p>{room.description}</p>
                <p>
                  Contact Apna Aashiyana directly to confirm the current
                  availability, room condition, facilities and booking terms.
                </p>
              </section>
            </div>

            <aside className="booking-card">
              <span>Monthly Rent</span>
              <h2>
                ₹{room.price.toLocaleString("en-IN")}
                <small> / month</small>
              </h2>

              <hr />

              <p>✓ Direct booking with property management</p>
              <p>✓ Room visit can be arranged</p>
              <p>✓ Availability confirmed by our team</p>

              <Link
                href={{
                  pathname: "/booking",
                  query: { room: id },
                }}
                className="details-book-button"
              >
                Book This Room →
              </Link>

              <Link href="/#contact" className="details-contact-button">
                Send Enquiry
              </Link>

              <small className="booking-note">
                Final rent, security deposit and availability will be
                confirmed by property management.
              </small>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
