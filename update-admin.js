const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const uri = "mongodb+srv://kushalmahawar71_db_user:aX2ihzkEdL3L767l@cluster0.gsqys3y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(uri);
  const hash = await bcrypt.hash("Angel@infinite1", 10);
  
  const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
  }, { timestamps: true });
  
  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  
  let admin = await User.findOne({ email: "naazamusement@gmail.com" });
  if (admin) {
    admin.password = hash;
    await admin.save();
    console.log("Admin password successfully updated!");
  } else {
    admin = await User.create({
      name: "Naaz Admin",
      email: "naazamusement@gmail.com",
      phone: "0000000000",
      password: hash
    });
    console.log("Admin user successfully created!");
  }
  process.exit(0);
}

run().catch(err => {
  console.error("Error updating admin:", err);
  process.exit(1);
});
