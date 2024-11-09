# SwipeFit - README.md

## Overview

**SwipeFit** is a Next.js and React-based fashion app designed to help users create and save outfits by swiping through clothing items across different categories. The app provides a visually engaging, Tinder-like swipe interface to choose clothing pieces by gender and category, allowing users to put together outfits with ease. Users can save their curated outfits, view them in a visualizer, and access saved outfits for future reference. The app uses local storage to retain saved outfits between sessions.

## Features

- **Swipe to Select**: Swipe through different clothing items in each category (accessories, tops, bottoms, and shoes) and select items to create a complete outfit.
- **Gender Selection**: Choose gender-specific options (man, woman, or child) to view items tailored for each category.
- **Outfit Visualizer**: Visualize the selected outfit with all chosen pieces displayed.
- **Save and Load Outfits**: Save outfits with a custom name, load previously saved outfits, or delete outfits from the saved list.
- **Price Calculation**: Calculate the total price of the current outfit, making it easy to budget.
- **Responsive Design**: Designed for mobile and desktop use, making it accessible across devices.
- **Local Storage Support**: Save outfits to local storage for persistence across sessions.

## Components

- **Card**: Used to display clothing items with image, name, price, and description.
- **Tabs**: Navigation between the main sections: gender selection, item browsing, visualizer, and saved outfits.
- **Dialog**: Save outfit dialog that allows users to name and save their outfit for future use.
- **Progress Bar**: Shows category progress, allowing users to navigate between categories (accessories, tops, bottoms, and shoes).
- **Swipe Handlers**: Manages the swipe direction (left or right) to add or pass on items.

## Data Structure

- **Items**: Each item has properties such as `id`, `name`, `category`, `image`, `price`, `description`, `gender`, and `affiliateUrl`.
- **Outfit**: Represents the user's current outfit with four categories: accessories, tops, bottoms, and shoes.
- **Saved Outfit**: A structure that includes an outfit name and items, stored in local storage.

## Dependencies

- Next.js
- React
- `react-tinder-card` for swipe functionality
- `lucide-react` for icons
- Tailwind CSS for styling

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/azuraservices/swipefit.git
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

2. Install the necessary dependencies:
   ```bash
   npm run dev
   ```

## Usage

1. **Select Gender**: Start by choosing the gender to filter clothing items.
2. **Swipe to Add Items**: Navigate through each clothing category and swipe items to the right to add them to the outfit or left to skip.
3. **Visualize Outfit**: Once all categories are selected, view the complete outfit in the visualizer.
4. **Save Outfits**: Save outfits with a unique name for future use or access saved outfits from the "Saved" section.
5. **Calculate Price**: See the total price of the selected outfit, making it easier to review costs before purchasing.

## Development

To contribute to SwipeFit or customize it:

1. Fork the repository and create a new branch for your feature or fix.
2. Submit a pull request with a detailed description of the changes.

## **Enjoy Creating with SwipeFit!**