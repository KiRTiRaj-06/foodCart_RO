function Register() {
  return (
    <div className="page">
      <h1>Register</h1>

      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <button>Create Account</button>
    </div>
  );
}

export default Register;