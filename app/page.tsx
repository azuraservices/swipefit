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
import { Tabs, TabsContent } from '@/components/ui/tabs';
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Shirt, BookMarked, X, Check } from 'lucide-react';

type Item = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  description: string;
};

const mockItems: Item[] = [
  { id: '1', name: 'White T-Shirt', category: 'tops', image: 'https://picsum.photos/200', price: 19.99, description: 'Classic white tee.' },
  { id: '2', name: 'Black T-Shirt', category: 'tops', image: 'https://picsum.photos/200', price: 19.99, description: 'Versatile black tee.' },
  { id: '3', name: 'Blue Jeans', category: 'bottoms', image: 'https://picsum.photos/200', price: 49.99, description: 'Comfortable jeans.' },
  { id: '4', name: 'Black Jeans', category: 'bottoms', image: 'https://picsum.photos/200', price: 49.99, description: 'Sleek black jeans.' },
  { id: '5', name: 'Sneakers', category: 'shoes', image: 'https://picsum.photos/200', price: 79.99, description: 'Stylish sneakers.' },
  { id: '6', name: 'Boots', category: 'shoes', image: 'https://picsum.photos/200', price: 99.99, description: 'Durable boots.' },
  { id: '7', name: 'Hat', category: 'accessories', image: 'https://picsum.photos/200', price: 24.99, description: 'Trendy hat.' },
  { id: '8', name: 'Scarf', category: 'accessories', image: 'https://picsum.photos/200', price: 29.99, description: 'Soft scarf.' },
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedOutfits');
    if (saved) {
      setSavedOutfits(JSON.parse(saved));
    }
    resetCurrentItems();
  }, [currentCategory]);

  const resetCurrentItems = () => {
    setCurrentItems(mockItems.filter((item) => item.category === categories[currentCategory]));
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
    if (overlayRef.current) overlayRef.current.style.backgroundColor = 'transparent'; // Rimuove il colore dell'overlay senza influenzare il contenuto

    if (direction === 'right') {
      addToOutfit(currentItems[0]);
      setCurrentItems((prev) => prev.slice(1));
    } else if (direction === 'left') {
      setCurrentItems((prev) => [...prev.slice(1), prev[0]]); // Riposiziona la carta alla fine per un ciclo infinito
    }
  };

  const handleSwipeRequirementFulfilled = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (overlayRef.current) {
      if (direction === 'left') {
        overlayRef.current.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Rosso per non scelto
      } else if (direction === 'right') {
        overlayRef.current.style.backgroundColor = 'rgba(0, 255, 0, 0.5)'; // Verde per scelto
      } else {
        overlayRef.current.style.backgroundColor = 'transparent'; // Ritorna trasparente quando centrato
      }
    }
  };

  return (
    <div className="container mx-auto p-2 pb-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Outfit Builder</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="browse">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Choose your {categories[currentCategory]}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-[60vh] relative">
              {currentItems.length > 0 && (
                <TinderCard
                  key={currentItems[0]?.id}
                  ref={cardRef}
                  onSwipe={onSwipe}
                  onSwipeRequirementFulfilled={handleSwipeRequirementFulfilled}
                  onCardLeftScreen={() => {
                    if (overlayRef.current) overlayRef.current.style.backgroundColor = 'transparent'; // Reset colore
                  }}
                  swipeRequirementType="position"
                  swipeThreshold={100}
                >
                  <Card className="w-64 h-80 flex flex-col justify-between relative transition-all duration-300">
                    <div ref={overlayRef} className="absolute inset-0 bg-transparent rounded-lg transition-all duration-300" />
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
                      <p className="text-center text-sm text-gray-500 mb-2">
                        ${currentItems[0].price.toFixed(2)}
                      </p>
                      <p className="text-center text-xs text-gray-600">{currentItems[0].description}</p>
                    </CardContent>
                  </Card>
                </TinderCard>
              )}
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button onClick={() => cardRef.current?.swipe('left')} variant="outline">
                <X className="mr-2 h-4 w-4" /> Dislike
              </Button>
              <Button onClick={() => cardRef.current?.swipe('right')}>
                <Check className="mr-2 h-4 w-4" /> Like
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="visualizer">
          <Card className="border-0">
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
          <Card className="border-0">
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