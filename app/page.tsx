'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import TinderCard from 'react-tinder-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, Shirt, BookMarked, Check, User, Flower2, Baby } from 'lucide-react';

// Types
type Gender = 'man' | 'woman' | 'child';
type OutfitItems = { [key: string]: Item | null };
type SavedOutfit = { name: string; items: OutfitItems };

type Item = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  description: string;
  gender: Gender | Gender[];
  affiliateUrl: string;
};

// Constants
const CATEGORIES = ['accessories', 'tops', 'bottoms', 'shoes'] as const;
const LOCAL_STORAGE_KEY = 'fashionApp_savedOutfits';

const MOCK_ITEMS: Item[] = [
  { id: '1', name: 'White T-Shirt', category: 'tops', image: '/images/whiteshirt.jpeg', price: 19.99, description: 'Classic white tee.', gender: ['man', 'woman', 'child'], affiliateUrl: 'https://amzn.to/3UGdm6A' },
  { id: '2', name: 'Black T-Shirt', category: 'tops', image: '/images/blackshirt.jpeg', price: 19.99, description: 'Versatile black tee.', gender: ['man', 'woman', 'child'], affiliateUrl: 'https://amzn.to/3UGdm6A' },
  { id: '3', name: 'Blue Jeans', category: 'bottoms', image: '/images/bluejeans.png', price: 49.99, description: 'Comfortable jeans.', gender: ['man', 'woman', 'child'], affiliateUrl: 'https://amzn.to/3UGdm6A' },
  { id: '4', name: 'Black Jeans', category: 'bottoms', image: '/images/blackjeans.png', price: 49.99, description: 'Sleek black jeans.', gender: ['man', 'woman', 'child'], affiliateUrl: 'https://amzn.to/3UGdm6A' },
  { id: '5', name: 'Sneakers', category: 'shoes', image: '/images/shoes.jpeg', price: 79.99, description: 'Stylish sneakers.', gender: ['man', 'woman', 'child'], affiliateUrl: 'https://amzn.to/3UGdm6A' },
  { id: '6', name: 'Boots', category: 'shoes', image: '/images/boots.jpeg', price: 99.99, description: 'Durable boots.', gender: ['man', 'woman', 'child'], affiliateUrl: 'https://amzn.to/3UGdm6A' },
  { id: '7', name: 'Hat', category: 'accessories', image: '/images/hat.png', price: 24.99, description: 'Trendy hat.', gender: ['man', 'woman', 'child'], affiliateUrl: 'https://amzn.to/3UGdm6A' },
  { id: '8', name: 'Scarf', category: 'accessories', image: '/images/scarf.jpeg', price: 29.99, description: 'Soft scarf.', gender: ['man', 'woman', 'child'], affiliateUrl: 'https://amzn.to/3UGdm6A' },
];

export default function FashionApp() {
  // State
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentItems, setCurrentItems] = useState<Item[]>([]);
  const [outfit, setOutfit] = useState<OutfitItems>({
    accessories: null,
    tops: null,
    bottoms: null,
    shoes: null,
  });
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('gender');
  const [fadingOut, setFadingOut] = useState(false);
  const [fadingIn, setFadingIn] = useState(false);

  // Refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<any>(null);

  // Load saved outfits and reset items on category change
  useEffect(() => {
    loadSavedOutfits();
    if (selectedGender) {
      resetCurrentItems();
    }
  }, [currentCategory, selectedGender]);

  // Helper Functions
  const loadSavedOutfits = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setSavedOutfits(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved outfits:', error);
    }
  };

  const resetCurrentItems = () => {
    setCurrentItems(
      MOCK_ITEMS.filter(
        (item) =>
          item.category === CATEGORIES[currentCategory] &&
          (Array.isArray(item.gender) ? item.gender.includes(selectedGender!) : item.gender === selectedGender)
      )
    );
  };

  const addToOutfit = (item: Item) => {
    setOutfit((prev) => ({ ...prev, [item.category]: item }));
    moveToNextCategory();
  };

  const removeFromOutfit = (category: string) => {
    setOutfit((prev) => ({ ...prev, [category]: null }));
  };

  const moveToNextCategory = () => {
    if (currentCategory < CATEGORIES.length - 1) {
      setCurrentCategory((prev) => prev + 1);
    } else {
      setActiveTab('visualizer');
    }
  };

  const saveOutfit = () => {
    if (Object.values(outfit).every((item) => item === null)) {
      return;
    }
    if (!outfitName.trim()) {
      return;
    }

    try {
      const newOutfit = { name: outfitName, items: outfit };
      const newSavedOutfits = [...savedOutfits, newOutfit];
      setSavedOutfits(newSavedOutfits);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedOutfits));
      setOutfitName('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving outfit:', error);
    }
  };

  const loadOutfit = (savedOutfit: SavedOutfit) => {
    setOutfit(savedOutfit.items);
    setActiveTab('visualizer');
  };

  const deleteOutfit = (index: number) => {
    try {
      const newSavedOutfits = savedOutfits.filter((_, i) => i !== index);
      setSavedOutfits(newSavedOutfits);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedOutfits));
    } catch (error) {
      console.error('Error deleting outfit:', error);
    }
  };

  const calculateTotalPrice = () => {
    return Object.values(outfit)
      .filter((item): item is Item => item !== null)
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2);
  };

  // Card Swipe Handlers
  const handleSwipe = (direction: string) => {
    setFadingOut(true);
  
    setTimeout(() => {
      if (direction === 'right' && currentItems.length > 0) {
        addToOutfit(currentItems[0]);
        setCurrentItems((prev) => prev.slice(1));
      } else if (direction === 'left' && currentItems.length > 0) {
        setCurrentItems((prev) => [...prev.slice(1), prev[0]]);
      }
      
      setFadingOut(false);
      setFadingIn(true);
  
      setTimeout(() => setFadingIn(false), 300);
    }, 300);
  };
  
  const handleSwipeRequirementFulfilled = (direction: string) => {
    if (overlayRef.current) {
      const overlayColor = direction === 'left' 
        ? 'rgba(255, 0, 0, 0.2)'
        : direction === 'right'
          ? 'rgba(0, 255, 0, 0.2)'
          : 'transparent';
      overlayRef.current.style.backgroundColor = overlayColor;
    }
  };

  const handleSwipeRequirementUnfulfilled = () => {
    if (overlayRef.current) {
      overlayRef.current.style.backgroundColor = 'transparent';
    }
  };
  
  const handleCardLeftScreen = () => {
    if (overlayRef.current) {
      overlayRef.current.style.backgroundColor = 'transparent';
    }
  };

  // Progress Bar Functions
  const handleProgressClick = (index: number) => {
    if (activeTab === 'browse') {
      setCurrentCategory(index);
    }
  };

  const renderProgressSteps = () => (
    <div className="fixed bottom-16 left-0 right-0 bg-background border-t px-4 py-2">
      <div className="flex justify-between mb-2">
        {CATEGORIES.map((category, index) => {
          const hasItem = !!outfit[category];
          const isCurrent = index === currentCategory;

          return (
            <button
              key={category}
              onClick={() => handleProgressClick(index)}
              className="flex flex-col items-center focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-4 h-4 mt-2 rounded-full">
                {hasItem ? (
                  <Check className="text-primary text-green-500" />
                ) : (
                  <div
                    className={`flex items-center justify-center w-4 h-4 rounded-full ${
                      isCurrent
                        ? 'bg-black text-white'
                        : 'bg-transparent text-muted-foreground border border-muted'
                    }`}
                  >
                    <span style={{ fontSize: '0.525rem' }}>{index + 1}</span>
                  </div>
                )}
              </div>
              <span
                className={`text-xs capitalize pt-1 ${
                  isCurrent ? 'text-primary font-bold' : 'text-muted-foreground'
                }`}
              >
                {category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderItemCard = (item: Item) => (
    <Card
      className={`w-full h-full flex flex-col justify-between relative max-h-[55vh] z-20 ${
        fadingOut ? 'card-fade-out' : fadingIn ? 'card-next card-next-active' : 'card-fade-in'
      }`}
    >
      <div 
        ref={overlayRef} 
        className="absolute inset-0 bg-transparent rounded-lg transition-all duration-300" 
      />
      <CardContent className="flex flex-col h-full">
        <div className="relative flex-grow justify-between items-center">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="rounded-lg object-contain m-0 p-0 "
          />
        </div>
        <div className="text-center space-y-2 mb-0">
          <p className="font-semibold text-lg">{item.name}</p>
          <p className="text-gray-500">€{item.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderOutfitItem = (category: string) => (
    <div key={category} className="relative w-full h-[300px]">
      {outfit[category] ? (
        <>
          <Image
            src={outfit[category]?.image ?? ''}
            alt={outfit[category]?.name ?? 'Outfit item'}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFromOutfit(category)}
            >
              Remove
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => window.open(outfit[category]?.affiliateUrl, '_blank')}
            >
              Buy
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
          No {category} selected
        </div>
      )}
    </div>
  );

  const handleGenderSelection = (gender: Gender) => {
    setSelectedGender(gender);
    setActiveTab('browse');
    setCurrentCategory(0);
  };

  return (
    <div className="flex-1 flex flex-col mx-auto container h-full max-h-screen">
      <h1 className="text-4xl font-black text-center">SwipeFit</h1>
  
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1">
        <TabsList className="hidden">
          <TabsTrigger value="gender">Gender</TabsTrigger>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
  
        <TabsContent value="gender">
          <CardTitle className="flex flex-col items-center p-4">Select Your Gender</CardTitle>
          <div className="flex flex-col gap-8 items-center mt-4">
            {(['man', 'woman', 'child'] as Gender[]).map((gender) => {
              // Scegli l'icona giusta in base al genere
              const IconComponent = gender === 'man' ? User : gender === 'woman' ? Flower2 : Baby;
              return (
                <Card 
                  key={gender} 
                  onClick={() => handleGenderSelection(gender)} 
                  className="flex flex-col items-center p-4 w-44 h-full border shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="mb-2">
                    {/* Icona Lucide React */}
                    <IconComponent className="w-10 h-10 mt-4 mb-4" />
                  </div>
                  <span className="text-center capitalize font-medium">{gender}</span>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="browse" className="flex flex-col flex-1">
          <Card className="flex flex-col flex-1 border-0 shadow-none overflow-visible">
            <CardHeader className="text-center">
              <CardTitle>Choose your <span className='font-bold underline'>{CATEGORIES[currentCategory]}</span></CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-visible">
              {currentItems.length > 0 && (
                <div className="h-full flex items-center justify-center">
                  <div className="w-full max-w-md aspect-[3/4] relative max-h-[calc(100vh-300px)]">
                    <TinderCard
                      key={currentItems[0].id}
                      ref={cardRef}
                      onSwipe={handleSwipe}
                      onSwipeRequirementFulfilled={handleSwipeRequirementFulfilled}
                      onSwipeRequirementUnfulfilled={handleSwipeRequirementUnfulfilled}
                      onCardLeftScreen={handleCardLeftScreen}
                      preventSwipe={['up', 'down']}
                      swipeRequirementType="position"
                      swipeThreshold={100}
                      className="absolute inset-0 flex-grow pr-4 pl-4 z-10"
                    >
                      {renderItemCard(currentItems[0])}
                    </TinderCard>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualizer">
          <Card className="border-0 shadow-none pb-32">
            <CardHeader>
              <CardTitle className="text-center">Outfit Visualizer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {CATEGORIES.map(renderOutfitItem)}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-lg font-semibold">
                Total: €{calculateTotalPrice()}
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Save Outfit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Your Outfit</DialogTitle>
                    <DialogDescription>
                      Give your outfit a name to save it for later.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="outfit-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="outfit-name"
                        value={outfitName}
                        onChange={(e) => setOutfitName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={saveOutfit}>Save</Button>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-center">Saved Outfits</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-300px)] w-full rounded-md border p-4 border-0 shadow-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedOutfits.map((savedOutfit, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{savedOutfit.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {Object.values(savedOutfit.items).map(
                            (item, itemIndex) =>
                              item && (
                                <div
                                  key={itemIndex}
                                  className="relative w-16 h-16"
                                >
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                  />
                                </div>
                              )
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button onClick={() => loadOutfit(savedOutfit)}>
                          Load
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteOutfit(index)}
                        >
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {activeTab === 'browse' && renderProgressSteps()}

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="container mx-auto">
          <div className="flex justify-around items-center h-16">
            <Button variant="ghost" onClick={() => setActiveTab('browse')}>
              <Search className="h-6 w-6" />
              <span className="sr-only">Browse</span>
            </Button>
            <Button variant="ghost" onClick={() => setActiveTab('visualizer')}>
              <Shirt className="h-6 w-6" />
              <span className="sr-only">Visualizer</span>
            </Button>
            <Button variant="ghost" onClick={() => setActiveTab('saved')}>
              <BookMarked className="h-6 w-6" />
              <span className="sr-only">Saved Outfits</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}