const { googleLogin } = require('../controller/authcontroller');
const User = require('../models/userModel');
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Palate = require("../models/Palate");
const Mood = require(`../models/Mood`);
const Dish = require('../models/Dish');
const path = require('path');
const xlsx = require('xlsx');
const {GoogleGenerativeAI} = require('@google/generative-ai');

require('dotenv').config;

const router = require('express').Router();
router.get('/test', (req, res) => {
    res.send('test pass');
});

router.get('/google', googleLogin);
router.get('/user/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
    
     
});
router.put('/profile/:id', async (req, res) => {
    try {
        const { name, email, phone, city  } = req.body;
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { name, email, mobile:phone, city },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/user/:id', async (req, res) => {
    try {
      const { gender, dob, mobile } = req.body;
      if (!gender || !dob || !mobile) {
        return res.status(400).json({ message: 'Gender, date of birth, and mobile are required' });
      }
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { gender, dob, mobile },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
  
router.post("/create/user", async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).send("Name, email, and phone are required");
        }
        const users = await User.find();
        const emailExists = users.some((user) => user.email === email);
        if(emailExists) {
            return res.status(400).send("Email already exists");
        }
        const otpSecret = speakeasy.generateSecret();
        const generatedOtp = speakeasy.totp({
            secret: otpSecret.base32,
            encoding: "base32",
            step: 300, 
        });

        const hashedOtp = await bcrypt.hash(generatedOtp, 10);

        const userNew = await User.create({
            name,
            email,
            phone,
            otp: hashedOtp,  
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Zique Verification System",
            html:`<!DOCTYPE html>
<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 10px;
                background: #f9f9f9;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px;
                background: #000000;
                color: white;
                border-radius: 10px 10px 0 0;
                overflow: hidden;
            }
            .content {
                padding: 20px;
                color: #333;
            }
            .otp {
                font-size: 1.5rem;
                color: #ba047e;
                font-weight: bold;
                text-align: center;
                display: block;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 0.9rem;
                color: #888;
                border-top: 1px solid #ccc;
                margin-top: 20px;
            }
            .logo {
                height: 50%;
                width: 50%;
                transform: scale(1.2);
                border-radius: 0.5rem;
            }

            /* Media Query for Smaller Screens */
            @media screen and (max-width: 768px) {
                .container {
                    margin: 10px;
                    padding: 15px;
                }
                .content {
                    padding: 15px;
                }
                .otp {
                    font-size: 1.25rem;
                }
                .logo {
                    width: 60%;
                    transform: scale(1);
                    height: 50%;
                }
            }

            @media screen and (max-width: 480px) {
                .container {
                    margin: 10px;
                    padding: 10px;
                }
                .content {
                    padding: 10px;
                }
                .otp {
                    font-size: 1rem;
                }
                .logo {
                    width: 70%;
                    height: 50%;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://i.pinimg.com/736x/14/d2/58/14d2584eea31adb80ada7857db8dc895.jpg" class="logo" alt="Zique Logo">
            </div>
            <div class="content">
                <p><b>Hi ${name},</b></p>
                <p>Welcome to Zique! We're excited to have you on board. To keep your account secure, we need to verify your email address. </p>
                <p>Your One-Time Password (OTP) is:</p>
                <p class="otp">${generatedOtp}</p>
                <p>This OTP is valid for the next 5 minutes. Please enter it on the web-app to complete your registration.</p>
                <p>If you didn't request this email, please ignore it. Your account is safe with us.</p>
                <p>Feel free to reach out if you have any questions or need assistance.</p>
                <p>Happy dining,</p>
                <p><b><i>The Zique Team</i></b></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Zique. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>
`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error sending email:", err);
                return res.status(500).send("Error sending OTP email");
            }

            res.status(201).json({
                message: `OTP sent to ${email} , please verify your OTP`,
                user : userNew,
            });
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Something went wrong");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send("Email is required");
        }
  
        const user = await User.findOne({ email });
        const name = user.name;
  
        if (!user) {
            return res.status(404).send("User not found");
        }
        const otpSecret = speakeasy.generateSecret();
        const generatedOtp = speakeasy.totp({
            secret: otpSecret.base32,
            encoding: "base32",
            step: 300,
        });
        const hashedOtp = await bcrypt.hash(generatedOtp, 10);
        user.otp = hashedOtp;
        await user.save();
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // Show debug output
        });
  
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Zique Verification System",
          html:`<!DOCTYPE html>
<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 10px;
                background: #f9f9f9;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px;
                background: #000000;
                color: white;
                border-radius: 10px 10px 0 0;
                overflow: hidden;
            }
            .content {
                padding: 20px;
                color: #333;
            }
            .otp {
                font-size: 1.5rem;
                color: #ba047e;
                font-weight: bold;
                text-align: center;
                display: block;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 0.9rem;
                color: #888;
                border-top: 1px solid #ccc;
                margin-top: 20px;
            }
            .logo {
                height: 50%;
                width: 50%;
                transform: scale(1.2);
                border-radius: 0.5rem;
            }

            /* Media Query for Smaller Screens */
            @media screen and (max-width: 768px) {
                .container {
                    margin: 10px;
                    padding: 15px;
                }
                .content {
                    padding: 15px;
                }
                .otp {
                    font-size: 1.25rem;
                }
                .logo {
                    width: 60%;
                    transform: scale(1);
                    height: 50%;
                }
            }

            @media screen and (max-width: 480px) {
                .container {
                    margin: 10px;
                    padding: 10px;
                }
                .content {
                    padding: 10px;
                }
                .otp {
                    font-size: 1rem;
                }
                .logo {
                    width: 70%;
                    height: 50%;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://i.pinimg.com/736x/14/d2/58/14d2584eea31adb80ada7857db8dc895.jpg" class="logo" alt="Zique Logo">
            </div>
            <div class="content">
                <p><b>Hi ${name},</b></p>
                <p>Welcome to Zique! We're excited to have you on board. To keep your account secure, we need to verify your email address. </p>
                <p>Your One-Time Password (OTP) is:</p>
                <p class="otp">${generatedOtp}</p>
                <p>This OTP is valid for the next 5 minutes. Please enter it on the web-app to complete your registration.</p>
                <p>If you didn't request this email, please ignore it. Your account is safe with us.</p>
                <p>Feel free to reach out if you have any questions or need assistance.</p>
                <p>Happy dining,</p>
                <p><b><i>The Zique Team</i></b></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Zique. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>
`
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              console.error("Error sending email:", err);
              return res.status(500).send("Error sending OTP email");
          }
  
          res.status(201).json({
              message: `OTP sent to ${email} , please verify your OTP`,
              user: user,
          });
      }
      );
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Something went wrong");
    }
  });
  router.post("/resend/:id", async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
        return res.status(404).send("User not found");
    }
   
    const name = user.name;
    const otpSecret = speakeasy.generateSecret();
    const generatedOtp = speakeasy.totp({
        secret: otpSecret.base32,
        encoding: "base32",
        step: 300,
    });
    const hashedOtp = await bcrypt.hash(generatedOtp, 10);
    user.otp = hashedOtp;
    await user.save();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Zique Verification System",
        html:`<!DOCTYPE html>
<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 10px;
                background: #f9f9f9;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px;
                background: #000000;
                color: white;
                border-radius: 10px 10px 0 0;
                overflow: hidden;
            }
            .content {
                padding: 20px;
                color: #333;
            }
            .otp {
                font-size: 1.5rem;
                color: #ba047e;
                font-weight: bold;
                text-align: center;
                display: block;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 0.9rem;
                color: #888;
                border-top: 1px solid #ccc;
                margin-top: 20px;
            }
            .logo {
                height: 50%;
                width: 50%;
                transform: scale(1.2);
                border-radius: 0.5rem;
            }

            /* Media Query for Smaller Screens */
            @media screen and (max-width: 768px) {
                .container {
                    margin: 10px;
                    padding: 15px;
                }
                .content {
                    padding: 15px;
                }
                .otp {
                    font-size: 1.25rem;
                }
                .logo {
                    width: 60%;
                    transform: scale(1);
                    height: 50%;
                }
            }

            @media screen and (max-width: 480px) {
                .container {
                    margin: 10px;
                    padding: 10px;
                }
                .content {
                    padding: 10px;
                }
                .otp {
                    font-size: 1rem;
                }
                .logo {
                    width: 70%;
                    height: 50%;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://i.pinimg.com/736x/14/d2/58/14d2584eea31adb80ada7857db8dc895.jpg" class="logo" alt="Zique Logo">
            </div>
            <div class="content">
                <p><b>Hi ${name},</b></p>
                <p>Welcome to Zique! We're excited to have you on board. To keep your account secure, we need to verify your email address. </p>
                <p>Your One-Time Password (OTP) is:</p>
                <p class="otp">${generatedOtp}</p>
                <p>This OTP is valid for the next 5 minutes. Please enter it on the web-app to complete your registration.</p>
                <p>If you didn't request this email, please ignore it. Your account is safe with us.</p>
                <p>Feel free to reach out if you have any questions or need assistance.</p>
                <p>Happy dining,</p>
                <p><b><i>The Zique Team</i></b></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Zique. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>
`
    
    }
     transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error sending email:", err);
            return res.status(500).send("Error sending OTP email");
        }
        res.status(201).json({
            message: `OTP sent to ${user.email} , please verify your OTP`,
            user: user,
        });
    });
  });

router.post("/verify/otp/:id", async (req, res) => {
    try {
        const { otp } = req.body;
        console.log(otp);
        if (!otp) {
            return res.status(400).send("OTP is required");
        }

        const user = await User.findOne({ _id: req.params.id });
        console.log(user);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isVerified = await bcrypt.compare(otp, user.otp);
        console.log(isVerified);
        const token = jwt.sign({ _id: user._id, email: user.email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT,
        });

        if (isVerified) {
            user.otp = null;  
            await user.save();

            return res.status(200).json({
                message: "OTP verified successfully",
                user: user,
                token: token,
            });
        } else {
            return res.status(400).json({
                message: "Invalid OTP, please try again",
            });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).send("Something went wrong");
    }
});


// creating Palate 

router.post("/palate/:id", async (req, res) => {
    try {
      const updateFields = {};
      const allowedFields = ["diet", "allergies", "cuisine", "staple", "dislikes"];
  
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateFields[field] = req.body[field];
        }
      });
  
      // Also include userId for consistency
      updateFields.userId = req.params.id;
  
      const updatedPalate = await Palate.findOneAndUpdate(
        { _id: req.params.id },
        updateFields,
        { new: true, upsert: true }
      );
  
      const foundUser = await User.findOne({ _id: req.params.id });
      const userName = foundUser?.name || "Unknown";
  
      res.status(201).json({
        message: "Palate Updated",
        userName,
        Palate: updatedPalate,
      });
    } catch (error) {
      res.status(404).send("Something went wrong: " + error.message);
    }
  });
  

  router.get("/palate/:id", async (req, res) => {
    try {
      const newPalate = await Palate.findOne({ userId: req.params.id });
      if (newPalate) {
        return res.status(201).json({
          newPalate,
        });
      } else {
        return res.json({
          message: "palate not found",
        });
      }
    } catch (error) {
      return res.status(404).json({
        message: "Some error occured",
        error: error.message,
      });
    }
  });



//   Creating the moods 
router.post("/create/mood/:id", async (req, res) => {
    try {
        console.log('api hit');
      const { flavour , meal , feel , cooking , protein , fats , calorie , carbs ,fit} = req.body;
      const newMood = await Mood.findOneAndUpdate({
        userId: req.params.id,
        
      },
      {
        meal: meal.split(","),
        flavour: flavour.split(","),
        feel: feel.split(","),
        method: cooking.split(","),
        protein,
        fats,
        calorie,
        carbs,
        fit
  
      },
      { new: true, upsert: true });
      res.json({
        message: "Mood Created ",
        mood: newMood,
      });
    } catch (error) {
        console.log(error.message);
      return res.status(404).send("something went wrong " + error.message);
    }
  });

  
  router.get("/mood/:id", async (req, res) => {
    try {
      const newMood = await Mood.findOne({ userId: req.params.id });
      if (newMood) {
        return res.status(201).json({
          newMood,
        });
      } else {
        return res.json({
          message: "Mood not found",
        });
      }
    } catch (error) {
      return res.status(404).json({
        message: "Some error occured",
        error: error.message,
      });
    }
  });






//   Recommmendation System 

// creating Dishes

// creating dishes through excel file
// http://localhost:3000/create-dish/Gigi/6758b0f3d8ae1c97bbca32d4
// for gigi
router.post('/upload-excel/:name/:id', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'uploads', 'Eve.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const dishes = xlsx.utils.sheet_to_json(sheet);
        console.log(dishes);


        for (let i = 0; i < dishes.length; i++) {
            const dish = dishes[i];
            console.log(dish['Dish_Name']);


            const calories = parseFloat(dish['Total_Calories_(kcal)']);
            const protein = parseFloat(dish['Total_Protein_(g)']);
            const carbs = parseFloat(dish['Total_Carbs_(g)']);
            const fats = parseFloat(dish['Total_Fats_(g)']);
            const price = parseFloat(dish['Price']) || 0;


            if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fats)) {
                console.log(`Skipping dish: ${dish['Dish_Name']} due to invalid numeric values.`);
                continue;
            }

            const newDish = new Dish({
                restaurant_id: req.params.id,
                restaurant_name: req.params.name,
                name: dish['Dish_Name'] || '',
                category: dish['Dish_Category'] || 'general',
                ingredients: dish['Ingredients'] ? dish['Ingredients'].split(',').map(item => item.trim()) : [],
                description: dish['Description'] || '',
                

                calories : dish['Total_Calories_(kcal)'],
        
                protein ,
                carbs ,
                fats,
                price,


                vegan: dish['Vegan'] ,
                vegetarian: dish['Vegetarian'] ,
                Non_Vegetarian: dish['Non-vegetarian'] ,
                Jain: dish['Jain'],
                Keto: dish['Keto'] ,
                Gluten_Free: dish['Gluten-Free'] ,
                cuisine: dish['Cuisine'] || '',

                flavor: dish['Flavor_Profile'] ? dish['Flavor_Profile'].split(',').map(item => item.trim()) : [],
                feel: dish['Feel/Texture'] ? dish['Feel/Texture'].split(',').map(item => item.trim()) : []
            });
            console.log(newDish);

            await newDish.save();
        }

        res.status(200).send('Dishes have been successfully uploaded and saved!');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading Excel file', error: error.message });
    }
});




// to delete dishes
router.delete('/delete-dishes/:restaurant_name', async (req, res) => {
    try {
        const restaurantName = req.params.restaurant_name;

        const result = await Dish.deleteMany({ restaurant_name: restaurantName });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: `Successfully deleted ${result.deletedCount} dishes from ${restaurantName}.` });
        } else {
            res.status(404).json({ message: 'No dishes found for the given restaurant.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting dishes', error: error.message });
    }
});



router.get('/zique/recommendations/:userid/:restaurantid', async (req, res) => {
    try {
        // Fetch userpalate

        const palate = await Palate.findOne({userId:req.params.userid});

  
        if (!palate) {
            return res.status(404).json({ message: "Palate not found for the user" });
        }
        // Fetching the user's mood
        

        const mood = await Mood.findOne({userId:req.params.userid});

        const dishes = await Dish.find({ restaurant_id: req.params.restaurantid });



      
        const dishNames = dishes.map(dish => dish.name).join(','); // List of dish names


        const diet = palate.diet.join(' ');
        const allergies = palate.allergies.join(' ');
        const cuisine = palate.cuisine.join(' ');
        const staple = palate.staple.join(' ');
        const dislikes = palate.dislikes.join(' ');
        const dishPrompt = `

    Strictly adhere to the user preferences . The user's preferences are as follows:
        
        
        ### User Preferences:
        - **Dietary Restrictions**: ${diet}
        - **Allergies**: ${allergies}
        - **Cuisine Preference (Strictly adhere to it )**: ${cuisine}
        - **Staple Ingredients**: ${staple}
        - **Dislikes**: ${dislikes}
        
        ### Mood Preferences:
        - **Flavour Profile**: ${mood.flavour.join(',')}
        - **Feel**: ${mood.feel.join(',')}
        - **Meal Type**: ${mood.meal.join(',')}
        - **Cooking Method**: ${mood.method.join(',')}

        Strictly adhere to the diet type : ${diet}
        
        ### Dish Details:
        ${dishes.map(dish => `- ${dish.name}: Ingredients (${dish.ingredients.join(', ')}), Description (${dish.description}), Cuisine:(${dish.cuisine}) , Calories (${dish.calories}), Protein (${dish.protein}g), Carbs (${dish.carbs}g), Fats (${dish.fats}g), Price (${dish.price}), Vegan (${dish.vegan}), Vegetarian (${dish.vegetarian}), Gluten-Free (${dish.Gluten_Free}), Non-Vegetarian (${dish.Non_Vegetarian}), Jain (${dish.Jain}), Keto (${dish.Keto})`).join('\n')}
        
        ### Selection Criteria:
        - Recommend dishes that best match **dietary restrictions, dislikes, and mood preferences**.
        - If fewer than 5 dishes fully match, suggest **the closest matching dishes and strictly adhere to ${diet} ** to ensure at least 5 recommendations.
        - Provide ONLY the dish names just dishnames with no extra characters/numberings in a **comma-separated format**.
        `;

        
        

        const genAI = new GoogleGenerativeAI(process.env.API);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const aiResult = await model.generateContent(dishPrompt);
        const recommendedDishesText = await aiResult.response.text();



        const recommendedDishNames = recommendedDishesText.split(',').map(dish => dish.trim());

        const aiRecommendedDishes = await Dish.find({ name: { $in: recommendedDishNames } });



        const prompt2 = `
        Suggest dessert names from the list below.
    
        **Dessert List:**
        ${dishes.map(dish => `- ${dish.name} | Ingredients: ${dish.ingredients.join(', ')} | Cuisine: ${dish.cuisine} | Calories: ${dish.calories} | Protein: ${dish.protein}g | Carbs: ${dish.carbs}g | Fats: ${dish.fats}g | Price: ${dish.price} | Vegan: ${dish.vegan} | Vegetarian: ${dish.vegetarian} | Gluten-Free: ${dish.Gluten_Free} | Non-Vegetarian: ${dish.Non_Vegetarian} | Jain: ${dish.Jain} | Keto: ${dish.Keto}`).join('\n')}
        
        **User Preferences (Strictly Follow):**
        - Diet: ${diet}  
        - Allergies: Avoid dishes containing ${allergies}
        - Cuisine: Prefer ${cuisine}
        - Staple Ingredients: Prefer ${staple}
        - Dislikes: Exclude dishes containing ${dislikes}
    
        If no exact match is found, suggest the closest possible dessert while maintaining adherence to **${diet}** and avoiding **${dislikes}** but only suggest desserts or sweet dish nothing else .
    
        **Output Format (Strictly Follow):**  
        - **Only dessert names**, separated by commas.  
        - **No explanations, no extra text, just the dessert names.**
    `;
    
        const deserts = await model.generateContent(prompt2);
        const desertsText = deserts.response.text();
        console.log(desertsText);
        const desertsNames = desertsText.split(',').map(desert=>desert.trim());
        const aiDeserts = await Dish.find({name: {$in: desertsNames}});



        // zique recommendations First we have to figure out the diet type from the user palate

        const prompt3 = `Give me a diet type (in less than 3 words e.g. vegan, keto, etc.)  from the following list: ${diet}.`;
        const aidiet = await model.generateContent(prompt3);
        const dietType =  aidiet.response.text().trim();

        const prompt4 = `
    Suggest some dishes from the following list of dishes: ${dishes.map(dish => `- ${dish.name}: Ingredients (${dish.ingredients.join(', ')}), Description (${dish.description}), Cuisine:(${dish.cuisine}) , Calories (${dish.calories}), Protein (${dish.protein}g), Carbs (${dish.carbs}g), Fats (${dish.fats}g), Price (${dish.price}), Vegan (${dish.vegan}), Vegetarian (${dish.vegetarian}), Gluten-Free (${dish.Gluten_Free}), Non-Vegetarian (${dish.Non_Vegetarian}), Jain (${dish.Jain}), Keto (${dish.Keto})`).join('\n')}
         based on the diet type strictly adhere to it : ${diet} Please provide dish names only separated by commas.
   
`;
        const prompt4response = await model.generateContent(prompt4);
        const dietDishesNames = prompt4response.response.text().split(',').map(dish => dish.trim());
        const dietDishes = await Dish.find({name: {$in: dietDishesNames}});

        const prompt5= `Give me a meal type (in less than 3 words e.g. breakfast, lunch, etc.)  from the following list: ${mood.meal}.`;
        const mealResponse = await model.generateContent(prompt5);
        const mealType = mealResponse.response.text().trim();
        const promptMoodDishes = `
        Suggest dish names from the list below that best match the meal type: ${mealType}.
        
        **Dish List:**
        ${dishes.map(dish => `- ${dish.name} | Ingredients: ${dish.ingredients.join(', ')} | Cuisine: ${dish.cuisine} | Calories: ${dish.calories} | Protein: ${dish.protein}g | Carbs: ${dish.carbs}g | Fats: ${dish.fats}g | Price: ${dish.price} | Vegan: ${dish.vegan} | Vegetarian: ${dish.vegetarian} | Gluten-Free: ${dish.Gluten_Free} | Non-Vegetarian: ${dish.Non_Vegetarian} | Jain: ${dish.Jain} | Keto: ${dish.Keto}`).join('\n')}
        
        **Selection Criteria (Strictly Follow):**
        - Flavor: ${mood.flavour.join(', ')}
        - Feel: ${mood.feel.join(', ')}
        - Cooking Method: ${mood.method.join(', ')}
        - Diet Type: ${diet} (Do not include dishes that violate this)
        - Allergies: Avoid dishes containing ${allergies}.
    
        If no exact match is found, suggest the closest possible dish while maintaining adherence to **${diet}** and strictly adhere to **${mood.feel.join(', ')}**.
        
        **Output Format (Strictly Follow):**  
        - **Only dish names**, separated by commas.  
        - **No additional text, no explanations, no bullet points, just dish names.**
    `;
    

    const moodDishesResponse = await model.generateContent(promptMoodDishes);

        const moodDishesNames = moodDishesResponse.response.text().split(',').map(dish => dish.trim());
        console.log(moodDishesResponse.response.text());

        const moodDishes = await Dish.find({ name: { $in: moodDishesNames } });

        // based on fitness goals 
        const prompt6 = ` ### Fitness Preferences:
        Strictly consider the following fitness preferences:
        - **Calories**: ${mood.calorie}
        - **Fats**: ${mood.fats} g
        - **Protein**: ${mood.protein} g
        - **Carbs**: ${mood.carbs} g
        Also strictly consider the diet type : ${dietType}
        Also consider these **Allergies**: ${allergies}
        
        ### Dish Details:
        ${dishes.map(dish => `- ${dish.name}: Ingredients (${dish.ingredients.join(', ')}), Description (${dish.description}), Calories (${dish.calories}), Protein (${dish.protein}g), Carbs (${dish.carbs}g), Fats (${dish.fats}g), Price (${dish.price}), Vegan (${dish.vegan}), Vegetarian (${dish.vegetarian}), Gluten-Free (${dish.Gluten_Free}), Non-Vegetarian (${dish.Non_Vegetarian}), Jain (${dish.Jain}), Keto (${dish.Keto})`).join('\n')}
        
        ### Selection Criteria:
        - Recommend dishes that best match **Fitness preferences**.
        -Strictly adhere to the fitness preferences.
        - If fewer than 5 dishes fully match, suggest **the closest matching dishes** to ensure at least 5 recommendations.
        - Provide ONLY the dish names just dishnames with no extra characters/numberings in a **comma-separated format**.`;

        const fitnessDishes = await model.generateContent(prompt6);
        const fitnessDishesText = await fitnessDishes.response.text();
        const fitnessDishesNames = fitnessDishesText.split(',').map(dish => dish.trim());
        const fitDishes = await Dish.find({ name: { $in: fitnessDishesNames } });
        console.log(mood.meal)

        res.status(200).json({

            aiRecommendedDishes: aiRecommendedDishes,
            dietDishes: dietDishes,
            deserts:mood.meal.includes('Dessert') ? aiDeserts : [],
            dietType: dietType,
            mealType: mealType,
            moodDishes,
            fitDishes : mood.fit===true ? fitDishes : [],


        });

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({
            message: "Error fetching recommendations",
            error: error.message
        });
    }
});

// Creating single dish
router.post('/create-dish', async (req, res) => {
    try {
        const {
            restaurant_id,
            restaurant_name,
            name,
            category,
            ingredients,
            description,
            price,
            calories,
            protein,
            fats,
            carbs,
            flavor,
            feel,
            vegan,
            vegetarian,
            Gluten_Free,
            Non_Vegetarian,
            Jain,
            Keto,
        } = req.body;

        const newDish = new Dish({
            restaurant_id,
            restaurant_name,
            name,
            category,
            ingredients: ingredients ? ingredients.split(',').map(item => item.trim()) : [],
            description,
            price,
            calories,
            protein,
            fats,
            carbs,
            flavor: flavor ? flavor.split(',').map(item => item.trim()) : [],
            feel: feel ? feel.split(',').map(item => item.trim()) : [],
            vegan,
            vegetarian,
            Gluten_Free,
            Non_Vegetarian,
            Jain,
            Keto,
        });

        await newDish.save();
        res.status(201).json({ message: "Dish created successfully", dish: newDish });
    } catch (error) {
        res.status(500).json({ message: "Error creating dish", error: error.message });
    }
});

// Fetching all dishes
router.get('/dishes/:restaurant_id', async (req, res) => {
    try {
        const dishes = await Dish.find({ restaurant_id: req.params.restaurant_id });
        res.status(200).json(dishes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching dishes", error: error.message });
    }
});

// Fetching single dish
router.get('/dish/:id', async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);
        if (!dish) {
            return res.status(404).json({ message: "Dish not found" });
        }
        res.status(200).json(dish);
    } catch (error) {
        res.status(500).json({ message: "Error fetching dish", error: error.message });
    }
});

// Updating single dish
router.post('/update-dish/:id', async (req, res) => {
    try {
        const { name, category, type, allergens, cuisine } = req.body;
        const updatedDish = await Dish.findByIdAndUpdate(req.params.id, {
            name,
            category,
            type: type ? type.split(',') : [],
            allergens: allergens ? allergens.split(',') : [],
            cuisine: cuisine ? cuisine.split(',') : [],
        }, { new: true });

        if (!updatedDish) {
            return res.status(404).json({ message: "Dish not found" });
        }
        res.status(200).json({ message: "Dish updated", dish: updatedDish });
    } catch (error) {
        res.status(500).json({ message: "Error updating dish", error: error.message });
    }
});









  
module.exports = router;