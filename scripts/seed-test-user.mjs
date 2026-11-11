






import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const TEST_USER = {
  userName: "sketchtester",
  email: "sketchtester@example.test",
  password: "pencil-Test-4821",
}

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error("MONGODB_URI is not set (run with --env-file=.env)")
  process.exit(1)
}

await mongoose.connect(uri)
const users = mongoose.connection.collection("users")

if (process.argv.includes("--remove")) {
  const { deletedCount } = await users.deleteOne({ userName: TEST_USER.userName })
  console.log(deletedCount ? "Test user removed." : "No test user found.")
} else {
  await users.updateOne(
    { userName: TEST_USER.userName },
    {
      $set: {
        userName: TEST_USER.userName,
        email: TEST_USER.email,
        password: await bcrypt.hash(TEST_USER.password, 10),
        verifyCode: "000000",
        verifyCodeExpiry: new Date(Date.now() + 3600000),
        isVerified: true,
        isAcceptingMessage: true,
        messages: [],
      },
    },
    { upsert: true }
  )
  console.log(`Test user @${TEST_USER.userName} is ready (inbox emptied).`)
}

await mongoose.disconnect()
