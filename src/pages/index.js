
import { useState } from "react";
import Head from "next/head";

const rooms = [
  {
    id: 1,
    name: "Single Occupancy",
    type: "Single",
    price: 12000,
    description: "Private room with personal space and comfortable furniture.",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900",
    features: ["Private Room", "Bed & Wardrobe", "Study Table"],
  },
  {
    id: 2,
    name: "Double Sharing",
    type: "Double",
    price: 8000,
    description: "Comfortable shared room with modern facilities.",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900",
    features: ["2 Beds", "Attached Storage", "Study Area"],
  },
  {
    id: 3,
    name: "Triple Sharing",
    type: "Triple",
    price: 6500,
    description: "Budget-friendly room for students and professionals.",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900",
    features: ["3 Beds", "Shared Storage", "Common Facilities"],
  },
];

const facilities = [
  { icon: "📶", title: "High-Speed Wi-Fi", desc: "Stay connected for work and study." },
  { icon: "📹", title: "CCTV Security", desc: "Security monitoring in common areas." },
  { icon: "🍽️", title: "Food Facility", desc: "Meal facility as per property plan." },
  { icon: "🧹", title: "Housekeeping", desc: "Clean and maintained living spaces." },
  { icon: "💧", title: "RO Drinking Water", desc: "Clean drinking water facility." },
  { icon: "⚡", title: "Power Backup", desc: "Backup facility during power cuts." },
  { icon: "🛏️", title: "Furnished Rooms", desc: "Comfortable beds and essential furniture." },
  { icon: "🚿", title: "Hot & Cold Water", desc: "Water facility for everyday comfort." },
];

const faqs = [
  {
    q: "Where is Apna Aashiyana located?",
    a: "Apna Aashiyana is located in Noida, Uttar Pradesh. Contact us for the exact property address.",
  },
  {
    q: "What room options are available?",
    a: "We plan to offer single, double-sharing and triple-sharing room options. Confirm current availability with our team.",
  },
  {
    q: "Are meals available?",
    a: "Meal availability and timings can be confirmed directly with the property management.",
  },
  {
    q: "How can I book a room?",
    a: "You can send an enquiry through the contact form or contact the property team to confirm availability and booking details.",
  },
  {
    q: "Can I visit the property before booking?",
    a: "Yes. Contact the property team to arrange a visit at a mutually convenient time.",
  },
];

export default function Home() {
  const [activeRoom, setActiveRoom] = useState("All");
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    room: "Double Sharing",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const filteredRooms =
    activeRoom === "All"
      ? rooms
      : rooms.filter((room) => room.type === activeRoom);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <Head>
        <title>Apna Aashiyana | Comfortable PG Accommodation in Noida</title>
        <meta
          name="description"
          content="Explore Apna Aashiyana, a comfortable PG accommodation in Noida. Discover rooms, facilities and booking information."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="site-header">
        <div className="container navbar">
          <a className="brand" href="#home">
            <span className="brand-icon">A</span>
            <span>
              Apna <strong>Aashiyana</strong>
              <small>Your Space. Your Comfort.</small>
            </span>
          </a>

          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#rooms">Rooms</a>
            <a href="#facilities">Facilities</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href="#contact" className="nav-button">
            Book Your Room
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-overlay">
            <div className="container hero-content">
              <span className="eyebrow">WELCOME TO APNA AASHIYANA</span>
              <h1>
                A Better Place
                <br />
                To <span>Call Home.</span>
              </h1>
              <p>
                Comfortable rooms, essential facilities and a welcoming
                environment for students and working professionals in Noida.
              </p>

              <div className="hero-actions">
                <a href="#rooms" className="primary-button">
                  Explore Rooms <span>→</span>
                </a>
                <a href="#about" className="outline-button">
                  Discover More
                </a>
              </div>

              <div className="hero-location">
                <span>📍</span> Noida, Uttar Pradesh
              </div>
            </div>
          </div>
        </section>

        {/* QUICK INTRO */}
        <section className="quick-info">
          <div className="container quick-grid">
            <div>
              <span>🏠</span>
              <div><strong>Comfortable Stay</strong><small>A place that feels like home</small></div>
            </div>
            <div>
              <span>🛏️</span>
              <div><strong>Multiple Room Types</strong><small>Single and sharing options</small></div>
            </div>
            <div>
              <span>📍</span>
              <div><strong>Noida Location</strong><small>Convenient city living</small></div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section" id="about">
          <div className="container about-grid">
            <div className="about-images">
              <img
                className="about-main-image"
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000"
                alt="Comfortable modern accommodation interior"
              />
              <div className="about-small-image">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700"
                  alt="Modern living space"
                />
              </div>
              <div className="about-tag">
                <strong>Apna Aashiyana</strong>
                <span>Your home away from home</span>
              </div>
            </div>

            <div className="about-content">
              <span className="section-label">ABOUT OUR PROPERTY</span>
              <h2>
                More Than A Room,
                <span> It's Your Aashiyana.</span>
              </h2>
              <p>
                Finding a comfortable place to stay is an important part of
                everyday life. Apna Aashiyana aims to provide a welcoming,
                convenient and comfortable PG experience in Noida.
              </p>
              <p>
                Whether you are a student or a working professional, explore
                our room options and choose a space that suits your needs.
              </p>
              <ul className="check-list">
                <li>Comfortable furnished room options</li>
                <li>Facilities for everyday living</li>
                <li>Friendly property assistance</li>
                <li>Direct booking with property management</li>
              </ul>
              <a href="#contact" className="primary-button">
                Enquire Now →
              </a>
            </div>
          </div>
        </section>

        {/* ROOMS */}
        <section className="section rooms-section" id="rooms">
          <div className="container">
            <div className="section-heading">
              <span className="section-label">OUR ACCOMMODATION</span>
              <h2>Find A Room That <span>Fits You</span></h2>
              <p>Explore the room options at Apna Aashiyana.</p>
            </div>

            <div className="room-filters">
              {["All", "Single", "Double", "Triple"].map((type) => (
                <button
                  key={type}
                  className={activeRoom === type ? "filter active" : "filter"}
                  onClick={() => setActiveRoom(type)}
                >
                  {type === "All" ? "All Rooms" : `${type} Sharing`}
                </button>
              ))}
            </div>

            <div className="room-grid">
              {filteredRooms.map((room) => (
                <article className="room-card" key={room.id}>
                  <div className="room-image">
                    <img src={room.image} alt={room.name} />
                    <span className="room-badge">{room.name}</span>
                  </div>
                  <div className="room-body">
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                    <ul>
                      {room.features.map((feature) => (
                        <li key={feature}>✓ {feature}</li>
                      ))}
                    </ul>
                    <div className="room-bottom">
                      <div className="room-price">
                        <strong>₹{room.price.toLocaleString("en-IN")}</strong>
                        <small>/ person / month</small>
                      </div>
                      <a
                        href={`/rooms/${room.id}`}
                        className="room-button"
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="sample-note">
              * Room prices are sample values for design purposes. Confirm
              actual rent, deposit and availability with the property owner.
            </p>
          </div>
        </section>

        {/* FACILITIES */}
        <section className="section" id="facilities">
          <div className="container">
            <div className="section-heading">
              <span className="section-label">LIVE COMFORTABLY</span>
              <h2>Facilities That Make <span>Life Easier</span></h2>
              <p>Everyday essentials for a comfortable stay.</p>
            </div>

            <div className="facility-grid">
              {facilities.map((facility) => (
                <div className="facility-card" key={facility.title}>
                  <div className="facility-icon">{facility.icon}</div>
                  <h3>{facility.title}</h3>
                  <p>{facility.desc}</p>
                </div>
              ))}
            </div>
            <p className="sample-note">
              * Facilities shown are proposed website content. Keep only the
              facilities actually available at your PG.
            </p>
          </div>
        </section>

        {/* WHY US */}
        <section className="why-section">
          <div className="container why-grid">
            <div>
              <span className="section-label light-label">WHY APNA AASHIYANA</span>
              <h2>A Comfortable Stay Starts With The Right Place.</h2>
              <p>
                We want your stay to be comfortable, convenient and simple.
                Connect directly with our property team for room details and
                availability.
              </p>
              <a href="#contact" className="primary-button">
                Talk To Us →
              </a>
            </div>
            <div className="why-points">
              <div><span>01</span><section><h3>Direct Enquiry</h3><p>Talk directly with the property team.</p></section></div>
              <div><span>02</span><section><h3>Room Choices</h3><p>Explore different occupancy options.</p></section></div>
              <div><span>03</span><section><h3>Easy Assistance</h3><p>Get help with visits and booking enquiries.</p></section></div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="section" id="gallery">
          <div className="container">
            <div className="section-heading">
              <span className="section-label">PROPERTY GALLERY</span>
              <h2>Take A Look <span>Inside</span></h2>
              <p>A preview of the kind of spaces you can showcase.</p>
            </div>
            <div className="gallery-grid">
              <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900" alt="Modern room interior" />
              <img src="https://images.unsplash.com/photo-1615874694520-474822394e73?w=900" alt="Furnished bedroom" />
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900" alt="Living room" />
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900" alt="Modern interior" />
            </div>
            <p className="sample-note">
              Replace these sample images with real photos of your own property.
            </p>
          </div>
        </section>

        {/* TESTIMONIAL PLACEHOLDER */}
        <section className="testimonial-section">
          <div className="container testimonial-content">
            <span className="section-label">A PLACE TO FEEL AT HOME</span>
            <h2>Your Comfort Is Our <span>Priority.</span></h2>
            <p>
              We look forward to welcoming you to Apna Aashiyana. Visit the
              property, explore the rooms and speak with our team before
              booking.
            </p>
            <a href="#contact" className="primary-button">Plan A Visit →</a>
          </div>
        </section>

        {/* FAQ */}
        <section className="section faq-section" id="faq">
          <div className="container faq-grid">
            <div>
              <span className="section-label">HAVE QUESTIONS?</span>
              <h2>Frequently Asked <span>Questions</span></h2>
              <p>Find answers to common questions about staying with us.</p>
              <a href="#contact" className="text-link">Ask us another question →</a>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div className="faq-item" key={faq.q}>
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    aria-expanded={openFaq === index}
                  >
                    {faq.q}
                    <span>{openFaq === index ? "−" : "+"}</span>
                  </button>
                  {openFaq === index && (
                    <p className="faq-answer">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <div className="contact-info">
              <span className="section-label">GET IN TOUCH</span>
              <h2>Let's Find Your <span>New Space.</span></h2>
              <p>
                Interested in staying at Apna Aashiyana? Send us your details
                and room preference. Our team can contact you with further
                information.
              </p>
              <div className="contact-detail">
                <span>📍</span><div><strong>Our Location</strong><p>Noida, Uttar Pradesh, India</p></div>
              </div>
              <div className="contact-detail">
                <span>🏠</span><div><strong>Property</strong><p>Apna Aashiyana PG</p></div>
              </div>
              <div className="contact-detail">
                <span>🕒</span><div><strong>Property Visits</strong><p>Contact us to arrange a visit</p></div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Book A Room / Send Enquiry</h3>
              <p>Fill in your details and preferred room type.</p>

              {submitted ? (
                <div className="form-success">
                  Your enquiry details have been entered. The form is currently
                  frontend-only; connect the booking API to receive enquiries.
                  <button type="button" onClick={() => setSubmitted(false)}>
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <>
                  <label>Your Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                  />

                  <label>Mobile Number</label>
                  <input
                    required
                    type="tel"
                    pattern="[0-9+\-\s]{10,15}"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter your mobile number"
                  />

                  <label>Preferred Room</label>
                  <select
                    value={form.room}
                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                  >
                    <option>Single Occupancy</option>
                    <option>Double Sharing</option>
                    <option>Triple Sharing</option>
                  </select>

                  <label>Message</label>
                  <textarea
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Your expected move-in date or questions"
                  />

                  <button type="submit" className="primary-button form-submit">
                    Send Enquiry →
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <a className="brand footer-brand" href="#home">
              <span className="brand-icon">A</span>
              <span>Apna <strong>Aashiyana</strong><small>Your Space. Your Comfort.</small></span>
            </a>
            <p>
              A comfortable PG accommodation experience in Noida for students
              and working professionals.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#rooms">Our Rooms</a>
            <a href="#facilities">Facilities</a>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="#gallery">Gallery</a>
            <a href="#faq">FAQs</a>
            <a href="#contact">Contact</a>
            <a href="#contact">Book A Room</a>
          </div>
          <div>
            <h4>Our Location</h4>
            <p>Noida, Uttar Pradesh, India</p>
            <a href="#contact">Send an enquiry →</a>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Apna Aashiyana. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
