import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: number;
  name: string;
  brand: string;
  type: string;
  nicotine: number;
  price: number;
  image: string;
  popular?: boolean;
};

type CartItem = Product & {
  quantity: number;
};

const products: Product[] = [
  { id: 1, name: "Luxe Crystal", brand: "VapeLux", type: "Одноразовая", nicotine: 20, price: 1290, image: "https://images.unsplash.com/photo-1511373535876-d214b0e3c75f?w=400", popular: true },
  { id: 2, name: "Gold Edition Pro", brand: "VapeLux", type: "POD-система", nicotine: 50, price: 3490, image: "https://images.unsplash.com/photo-1590393486261-e27cbb6dfe50?w=400", popular: true },
  { id: 3, name: "Black Diamond", brand: "EliteVape", type: "Одноразовая", nicotine: 30, price: 1490, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
  { id: 4, name: "Premium Starter Kit", brand: "CloudKing", type: "Набор", nicotine: 20, price: 2990, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400", popular: true },
  { id: 5, name: "Royal Mist", brand: "VapeLux", type: "Жидкость", nicotine: 6, price: 890, image: "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400" },
  { id: 6, name: "Platinum Series", brand: "EliteVape", type: "POD-система", nicotine: 35, price: 4290, image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400" },
  { id: 7, name: "Golden Vapor", brand: "CloudKing", type: "Жидкость", nicotine: 12, price: 990, image: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400" },
  { id: 8, name: "Elite Max", brand: "EliteVape", type: "Одноразовая", nicotine: 50, price: 1790, image: "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=400" },
];

const Index = () => {
  const { toast } = useToast();
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [nicotineFilter, setNicotineFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const brands = Array.from(new Set(products.map(p => p.brand)));
  const types = Array.from(new Set(products.map(p => p.type)));

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
    const matchNicotine = 
      nicotineFilter === "all" ||
      (nicotineFilter === "low" && product.nicotine <= 20) ||
      (nicotineFilter === "medium" && product.nicotine > 20 && product.nicotine <= 35) ||
      (nicotineFilter === "high" && product.nicotine > 35);
    
    return matchPrice && matchBrand && matchType && matchNicotine;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Товар добавлен в корзину",
      description: product.name,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Sparkles" className="text-primary-foreground" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-primary">VapeLux</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Главная</a>
            <a href="#catalog" className="text-foreground hover:text-primary transition-colors">Каталог</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">О нас</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Icon name="Search" size={20} />
            </Button>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Icon name="ShoppingCart" className="text-primary" size={24} />
                    Корзина
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full pt-6">
                  {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                      <Icon name="ShoppingCart" size={64} className="text-muted-foreground mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Корзина пуста</h4>
                      <p className="text-sm text-muted-foreground">Добавьте товары из каталога</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-auto -mx-6 px-6 space-y-4">
                        {cart.map(item => (
                          <Card key={item.id} className="border-border/50">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold truncate">{item.name}</h5>
                                  <p className="text-sm text-muted-foreground">{item.brand}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Icon name="Minus" size={14} />
                                    </Button>
                                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Icon name="Plus" size={14} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 ml-auto text-destructive"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      <Icon name="Trash2" size={14} />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-primary">{item.price * item.quantity} ₽</div>
                                  <div className="text-xs text-muted-foreground">{item.price} ₽ × {item.quantity}</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="mt-6 space-y-4">
                        <Separator />
                        <div className="flex justify-between items-center text-lg">
                          <span className="font-semibold">Итого:</span>
                          <span className="text-2xl font-bold text-primary">{cartTotal} ₽</span>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
                          <Icon name="CreditCard" className="mr-2" size={20} />
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <Badge variant="outline" className="border-primary text-primary px-4 py-2">
                Премиум качество
              </Badge>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Элегантность в каждой детали
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Откройте мир изысканных вкусов с нашей коллекцией премиальных электронных сигарет
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Icon name="ShoppingBag" className="mr-2" size={20} />
                Перейти в каталог
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: "Award", text: "Премиум качество" },
              { icon: "Truck", text: "Быстрая доставка" },
              { icon: "ShieldCheck", text: "Гарантия качества" },
              { icon: "Headphones", text: "Поддержка 24/7" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name={item.icon} className="text-primary" size={24} />
                </div>
                <p className="text-sm font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Наш каталог</h3>
            <p className="text-muted-foreground">Тщательно отобранные продукты для истинных ценителей</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 space-y-6">
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Icon name="Filter" className="mr-2" size={20} />
                  Фильтры
                </Button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <Card className="bg-card border-border/50">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Icon name="DollarSign" size={18} className="text-primary" />
                        Цена
                      </h4>
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          min={0}
                          max={5000}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{priceRange[0]} ₽</span>
                          <span>{priceRange[1]} ₽</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Icon name="Zap" size={18} className="text-primary" />
                        Крепость никотина
                      </h4>
                      <Select value={nicotineFilter} onValueChange={setNicotineFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Любая</SelectItem>
                          <SelectItem value="low">Низкая (до 20 мг)</SelectItem>
                          <SelectItem value="medium">Средняя (20-35 мг)</SelectItem>
                          <SelectItem value="high">Высокая (35+ мг)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Icon name="Package" size={18} className="text-primary" />
                        Тип
                      </h4>
                      <div className="space-y-3">
                        {types.map(type => (
                          <div key={type} className="flex items-center gap-2">
                            <Checkbox
                              id={type}
                              checked={selectedTypes.includes(type)}
                              onCheckedChange={() => toggleType(type)}
                            />
                            <label htmlFor={type} className="text-sm cursor-pointer">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Icon name="Star" size={18} className="text-primary" />
                        Бренд
                      </h4>
                      <div className="space-y-3">
                        {brands.map(brand => (
                          <div key={brand} className="flex items-center gap-2">
                            <Checkbox
                              id={brand}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => toggleBrand(brand)}
                            />
                            <label htmlFor={brand} className="text-sm cursor-pointer">
                              {brand}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setPriceRange([500, 5000]);
                        setSelectedBrands([]);
                        setSelectedTypes([]);
                        setNicotineFilter("all");
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Найдено товаров: <span className="text-foreground font-semibold">{filteredProducts.length}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.popular && (
                        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                          <Icon name="TrendingUp" size={14} className="mr-1" />
                          Популярное
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {product.name}
                          </h5>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-primary/30">
                          {product.nicotine} мг
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        {product.price} ₽
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => addToCart(product)}>
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        Купить
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <Icon name="PackageX" size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Ничего не найдено</h4>
                  <p className="text-muted-foreground">Попробуйте изменить параметры фильтрации</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Sparkles" className="text-primary-foreground" size={20} />
                </div>
                <h3 className="text-xl font-bold text-primary">VapeLux</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Премиальные электронные сигареты и жидкости для истинных ценителей
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Одноразовые</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">POD-системы</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Жидкости</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Аксессуары</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О компании</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Оплата</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-primary" />
                  +7 (999) 123-45-67
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} className="text-primary" />
                  info@vapelux.ru
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 VapeLux. Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;