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
import { Separator } from '@/components/ui/separator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Shirt, BookMarked, ShoppingBag, X, Check } from 'lucide-react';

// Tipo per i dati degli articoli di moda
type Item = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  description: string;
};

// Mock data per gli articoli di moda
const mockItems: Item[] = [
  {
    id: '1',
    name: 'White T-Shirt',
    category: 'tops',
    image: 'https://picsum.photos/200',
    price: 19.99,
    description: 'Classic white tee, perfect for any casual outfit.',
  },
  {
    id: '2',
    name: 'Black T-Shirt',
    category: 'tops',
    image: 'https://picsum.photos/200',
    price: 19.99,
    description: 'Versatile black tee, a wardrobe essential.',
  },
  {
    id: '3',
    name: 'Blue Jeans',
    category: 'bottoms',
    image: 'https://picsum.photos/200',
    price: 49.99,
    description: 'Comfortable blue jeans for everyday wear.',
  },
  {
    id: '4',
    name: 'Black Jeans',
    category: 'bottoms',
    image: 'https://picsum.photos/200',
    price: 49.99,
    description: 'Sleek black jeans, perfect for day or night.',
  },
  {
    id: '5',
    name: 'Sneakers',
    category: 'shoes',
    image: 'https://picsum.photos/200',
    price: 79.99,
    description: 'Stylish and comfortable sneakers for active lifestyles.',
  },
  {
    id: '6',
    name: 'Boots',
    category: 'shoes',
    image: 'https://picsum.photos/200',
    price: 99.99,
    description: 'Durable boots suitable for various occasions.',
  },
  {
    id: '7',
    name: 'Hat',
    category: 'accessories',
    image: 'https://picsum.photos/200',
    price: 24.99,
    description: 'Trendy hat to complete your look.',
  },
  {
    id: '8',
    name: 'Scarf',
    category: 'accessories',
    image: 'https://picsum.photos/200',
    price: 29.99,
    description: 'Soft scarf for added warmth and style.',
  },
];

const categories = ['accessories', 'tops', 'bottoms', 'shoes'];

export default function FashionApp() {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentItems, setCurrentItems] = useState<Item[]>([]);
  const [outfit, setOutfit] = useState<{ [key: string]: Item | null }>({
    accessories: null,
    tops: null,
    bottoms: null,
    shoes: null,
  });
  const [savedOutfits, setSavedOutfits] = useState<{ name: string; items: { [key: string]: Item | null } }[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null); // Stato per la direzione dello swipe

  const cardRef = useRef<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedOutfits');
    if (saved) {
      setSavedOutfits(JSON.parse(saved));
    }
    resetCurrentItems();
  }, [currentCategory]);

  const resetCurrentItems = () => {
    setCurrentItems(
      mockItems.filter((item) => item.category === categories[currentCategory])
    );
  };

  const addToOutfit = (item: Item) => {
    setOutfit((prev) => ({ ...prev, [item.category]: item }));
    toast.success(`Added ${item.name} to your outfit!`);
    moveToNextCategory();
  };

  const removeFromOutfit = (category: string) => {
    setOutfit((prev) => ({ ...prev, [category]: null }));
    toast.info(`Removed ${category} from your outfit.`);
  };

  const moveToNextCategory = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory((prev) => prev + 1);
    } else {
      toast.info("You've completed your outfit!");
      setActiveTab('visualizer');
    }
  };

  const saveOutfit = () => {
    if (Object.values(outfit).every((item) => item === null)) {
      toast.error('Please add at least one item to your outfit before saving.');
      return;
    }
    if (!outfitName.trim()) {
      toast.error('Please enter a name for your outfit.');
      return;
    }
    const newOutfit = { name: outfitName, items: outfit };
    const newSavedOutfits = [...savedOutfits, newOutfit];
    setSavedOutfits(newSavedOutfits);
    localStorage.setItem('savedOutfits', JSON.stringify(newSavedOutfits));
    setOutfitName('');
    setIsDialogOpen(false);
    toast.success('Outfit saved successfully!');
  };

  const loadOutfit = (savedOutfit: { name: string; items: { [key: string]: Item | null } }) => {
    setOutfit(savedOutfit.items);
    setActiveTab('visualizer');
    toast.info(`Loaded outfit: ${savedOutfit.name}`);
  };

  const deleteOutfit = (index: number) => {
    const newSavedOutfits = savedOutfits.filter((_, i) => i !== index);
    setSavedOutfits(newSavedOutfits);
    localStorage.setItem('savedOutfits', JSON.stringify(newSavedOutfits));
    toast.success('Outfit deleted successfully!');
  };

  const calculateTotalPrice = () => {
    return Object.values(outfit)
      .filter((item): item is Item => item !== null)
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2);
  };

  const onSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'left' || direction === 'right') {
      setSwipeDirection(direction);
  
      if (direction === 'right') {
        addToOutfit(currentItems[0]);
      } else {
        setCurrentItems((prev) => [...prev.slice(1), prev[0]]);
      }
  
      setTimeout(() => setSwipeDirection(null), 800);
    }
  };

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Fashion Outfit Builder
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="browse">
        <Card className='border-0'>
          <CardHeader>
            <CardTitle>Browse Items - {categories[currentCategory]}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[60vh] relative">
            {currentItems.length > 0 && (
              <TinderCard
                key={currentItems[0]?.id}
                ref={cardRef}
                onSwipe={onSwipe}
                swipeRequirementType="position"
                swipeThreshold={100}
              >
                <Card className="w-64 h-80 flex flex-col justify-between relative">
                  {swipeDirection && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-lg bg-opacity-50 transition-opacity duration-300 ${
                        swipeDirection === 'right' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {swipeDirection === 'right' ? (
                        <Check className="text-white h-12 w-12" />
                      ) : (
                        <X className="text-white h-12 w-12" />
                      )}
                    </div>
                  )}

                  <CardContent className="p-4">
                    <div className="relative w-full h-48 mb-2 flex items-center justify-center overflow-hidden">
                      <Image
                        src={currentItems[0].image}
                        alt={currentItems[0].name}
                        width={200}
                        height={200}
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <p className="text-center font-semibold">{currentItems[0].name}</p>
                    <p className="text-center text-sm text-gray-500 mb-2">${currentItems[0].price.toFixed(2)}</p>
                    <p className="text-center text-xs text-gray-600">{currentItems[0].description}</p>
                  </CardContent>
                </Card>
              </TinderCard>
            )}
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={() => cardRef.current.swipe('left')} variant="outline">
              <X className="mr-2 h-4 w-4" /> Dislike
            </Button>
            <Button onClick={() => cardRef.current.swipe('right')}>
              <Check className="mr-2 h-4 w-4" /> Like
            </Button>
          </CardFooter>
        </Card>
        </TabsContent>

        <TabsContent value="visualizer">
          <Card className='border-0'>
            <CardHeader>
              <CardTitle>Outfit Visualizer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {categories.map((category) => (
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
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeFromOutfit(category)}
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
                      No {category} selected
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-lg font-semibold">
                Total: ${calculateTotalPrice()}
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
          <Card className='border-0'>
            <CardHeader>
              <CardTitle>Saved Outfits</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-300px)] w-full rounded-md border p-4">
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

      <ToastContainer position="bottom-right" />
    </div>
  );
}
