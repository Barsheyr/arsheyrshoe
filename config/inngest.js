// import { Inngest } from "inngest";

// // Create the client outside of any functions or exports
// export const inngest = new Inngest({ id: "arsheyrshoe" });

// // Import these only when the function is actually running
// const importDependencies = async () => {
//   const connectDB = (await import("./db")).default;
//   const User = (await import("@/models/User")).default;
//   return { connectDB, User };
// };

// // Sync user creation function
// export const syncUserCreation = inngest.createFunction(
//   {
//     id: "sync-user-from-clerk",
//   },
//   {
//     event: "clerk/user.created",
//   },
//   async ({ event }) => {
//     try {
//       const { id, first_name, last_name, email_addresses, image_url } =
//         event.data;

//       const userData = {
//         _id: id,
//         email: email_addresses?.[0]?.email_address, // fixed here
//         name: `${first_name} ${last_name}`,
//         imageUrl: image_url,
//       };

//       await connectDB();
//       await User.create(userData);

//       return { success: true };
//     } catch (error) {
//       console.error("Error syncing user creation:", error);
//       return { success: false, error: error.message || "Unknown error" };
//     }
//   }
// );

// // Update user function
// export const syncUserUpdation = inngest.createFunction(
//   { id: "update-user-free-clerk" },
//   { event: "clerk/user.updated" },
//   async ({ event }) => {
//     const { connectDB, User } = await importDependencies();

//     const { id, first_name, last_name, email_addresses, image_url } =
//       event.data;
//     const userData = {
//       _id: id,
//       email: email_addresses[0].email_address, // Fixed typo
//       name: first_name + " " + last_name,
//       imageUrl: image_url,
//     };

//     await connectDB();
//     await User.findByIdAndUpdate(id, userData);
//     return { success: true };
//   }
// );

// // Delete user function
// export const syncUserDeletion = inngest.createFunction(
//   { id: "delete-user_with_clerk" },
//   { event: "clerk/user.deleted" },
//   async ({ event }) => {
//     const { connectDB, User } = await importDependencies();

//     const { id } = event.data;
//     await connectDB();
//     await User.findByIdAndDelete(id);
//     return { success: true };
//   }
// );

import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "arsheyrshoe" });

// ingest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_addresses,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await connectDB();
    await User.create(userData);
  }
);

// INNGEST FUNCTION TO UPDATE USER DATA IN DATABASE

export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-free-clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_addresses,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user_with_clerk",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
