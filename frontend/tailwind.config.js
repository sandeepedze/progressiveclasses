/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#1F2937", // Near Black
                secondary: "#6B7280", // Cool Gray
                accent: {
                    mint: "#E0F2F1",
                    pink: "#FCE4EC",
                    blue: "#E3F2FD",
                },
                offWhite: "#F8F9FA",
            },
            fontFamily: {
                // defined by Expo's font loader
            }
        },
    },
    plugins: [],
}
