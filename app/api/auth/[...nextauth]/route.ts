// import NextAuth, { NextAuthOptions } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { jwtDecode } from "jwt-decode";

// const NextOption: NextAuthOptions = {
//   pages: {
//     signIn: "/login",
//   },
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: {},
//         password: {},
//       },
//       async authorize(credentials) {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/login`,
//           {
//             method: "POST",
//             body: JSON.stringify({
//               email: credentials?.email,
//               password: credentials?.password,
//             }),
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         let data
//         try {
//          data = await res.json();
//           console.log("🔥 Backend Response:", data); // Check your VS Code terminal
//         } catch (err) {
//           console.log("🔥 Failed to parse JSON", err);
//           throw new Error("Invalid backend JSON response");
//         }

//         if (res.ok) {
//           if (!data.token) {
//             console.log("🔥 Missing Token in Response:", data);
//             throw new Error(`Token Not Found! Backend returned: ${JSON.stringify(data)}`);
//           }

//           const JwtDecodeToken: { id: string } = jwtDecode(data.token);
//           return {
//             id: JwtDecodeToken.id,
//             user: data.user,
//             token: data.token,
//           };
//         } else {
//           throw new Error(data.message || "Failed to login");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }: { token: any, user: any }) {
//       if (user) {
//         token.token = user.token
//         token.user = user.user
//       }
//       return token
//     },
//     async session({ session, token }: { session: any, token: any }) {
//         console.log(session)
        
//       session.user = token.user

//       return session
//     },
//   },
// };

// const handler = NextAuth(NextOption);

// export { handler as GET, handler as POST, NextOption };
