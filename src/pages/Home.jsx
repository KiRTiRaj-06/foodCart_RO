function Home() {
  return (
    <div className="home">

      <h1 className="title">Welcome to The Raya's Kitchen</h1>

      <div className="flip-container">

        {/* Offers */}
        <div className="flip-card">
          <div className="flip-inner">
            <div className="flip-front">
              <h2> Offers</h2>
            </div>
            <div className="flip-back">
              <p>10% OFF on orders above ₹500</p>
              <p>Free delivery on weekends</p>
            </div>
          </div>
        </div>

        {/* Featured */}
        <div className="flip-card">
          <div className="flip-inner">
            <div className="flip-front">
              <h2>Featured</h2>
            </div>
            <div className="flip-back">
              <p>Chef’s Special Burger</p>
              <p>Trending Veg Meals</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flip-card">
          <div className="flip-inner">
            <div className="flip-front">
              <h2>Categories</h2>
            </div>
            <div className="flip-back">
              <p>Burgers</p>
              <p>Pizza</p>
              <p>Drinks</p>
              <p>Desserts</p>
            </div>
          </div>
        </div>

        <div className="story-section">

  {/* LEFT SIDE */}
  <div className="story-left">
    <h1>The Story Behind <br /> The OG House</h1>

    <p>
      Founded with a simple mission: to elevate food experience.
      Our kitchen combines traditional techniques with modern flavors.
    </p>

    <p>
      Every item on our menu tells a story of dedication,
      quality, and culinary excellence.
    </p>

    <button className="story-btn">Learn More About Us</button>
  </div>

  {/* RIGHT SIDE */}
  <div className="story-right">

    <div className="info-card">
      <h3>👨‍🍳 Master Craftsmanship</h3>
      <p>
        Every dish is prepared by expert chefs using the finest ingredients.
      </p>
    </div>

    <div className="info-card">
      <h3>Passion for Quality</h3>
      <p>
        We source locally and never compromise on quality.
      </p>
    </div>

    <div className="info-card">
      <h3>Community Focused</h3>
      <p>
        We serve our community with pride and connection.
      </p>
    </div>

  </div>
</div>

      </div>
    </div>
  );
}

export default Home;