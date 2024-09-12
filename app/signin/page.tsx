"use client";
// biome-ignore lint/style/useImportType: <explanation>
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';



const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true); // Toggle between sign-in and register forms
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [organization, setOrganization] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")
  const [error, setError] = useState('');
  const [accesscode, setAccessCode] = useState("")
  const router = useRouter(); // For navigation

  // Dummy sign-in method (you will replace this with your actual sign-in logic)
  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
        setError("Please enter all fields.");
        return;
    }

    try {
        const res = await signIn('credentials', {
            email, 
            password, 
            redirect: true, // Allow NextAuth.js to handle redirects
            callbackUrl: '/', // Redirect to homepage after successful sign-in
        });

        if (res?.error) {
            setError("Invalid credentials");
            return;
        }

        // Redirect to home page if successful
        router.replace('/');
    } catch (error) {
        console.error("Error during sign-in:", error);
        setError("An unexpected error occurred. Please try again.");
    }
};
  
  // Dummy register method (you will replace this with your actual registration logic)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if(accesscode!=="12345678910"){
        alert("Wrong Access Code");
        return;
    }
    if (password !== conPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registering with", name, email, role, organization, password);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          organization,
        }),
      });
  
      if (response.ok) {
        alert('Registration successful!');
        setIsSignIn(true);  // Switch to sign-in form after registration
      } else {
        const data = await response.json();
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration.');
    }
  };
  

  return (
    <section className="w-full flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-4 bg-slate-100 my-8 shadow-md rounded-lg">
        <h2 className="text-center text-2xl font-bold">
          {isSignIn ? "Sign In" : "Register"}
        </h2>

        {/* Form */}
        <form
          onSubmit={(e) =>
            isSignIn ? handleSignIn(e) : handleRegister(e)
          }
          className="space-y-4"
        >
        {error && <p className="error">{error}</p>}
          {/* Name field (only for registration) */}
          {!isSignIn && (
            <>
              {/* Access Key */}
              <div>
                <label htmlFor="accesskey" className="block text-sm font-medium">
                  Access key
                </label>
                <input
                  type="text"
                  id="accesskey"
                  name="accesskey"
                  value={accesscode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter the Access Key"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                />
              </div>
              
              {/* name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Role selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                >
                  <option value="" disabled selected>Choose Role</option>
                  <option value="employee">Employee</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="student">Student</option>
                </select>
              </div>

              {/* Organization input */}
              <div>
                <label htmlFor="organization" className="block text-sm font-medium">
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Enter your organization"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                />
              </div>
            </>
          )}

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Confirm Password field (only for registration) */}
          {!isSignIn && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={conPassword}
                onChange={(e) => setConPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                required
              />
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            {isSignIn ? "Sign In" : "Register"}
          </button>
        </form>

        {/* Toggle button */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-blue-500 hover:underline"
          >
            {isSignIn
              ? "Don't have an account? Register"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
