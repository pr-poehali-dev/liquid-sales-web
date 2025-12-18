import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  description?: string;
  features?: string[];
  volume?: string;
  puffs?: number;
};

const products: Product[] = [
  { 
    id: 1, 
    name: "Luxe Crystal", 
    brand: "VapeLux", 
    type: "Одноразовая", 
    nicotine: 20, 
    price: 1290, 
    image: "https://images.unsplash.com/photo-1511373535876-d214b0e3c75f?w=800", 
    popular: true,
    description: "Премиальная одноразовая электронная сигарета с кристально чистым вкусом. Идеальное сочетание дизайна и функциональности.",
    features: ["Компактный размер", "Мягкий обтекаемый дизайн", "Насыщенный вкус", "Удобный мундштук"],
    volume: "2 мл",
    puffs: 600
  },
  { 
    id: 2, 
    name: "Gold Edition Pro", 
    brand: "VapeLux", 
    type: "POD-система", 
    nicotine: 50, 
    price: 3490, 
    image: "https://images.unsplash.com/photo-1590393486261-e27cbb6dfe50?w=800", 
    popular: true,
    description: "Профессиональная POD-система премиум класса. Мощный аккумулятор и сменные картриджи для длительного использования.",
    features: ["Аккумулятор 850 мАч", "Быстрая зарядка USB-C", "Регулировка мощности", "LED-индикатор заряда", "Магнитное крепление картриджа"],
    volume: "2 мл (картридж)",
    puffs: 1200
  },
  { 
    id: 3, 
    name: "Black Diamond", 
    brand: "EliteVape", 
    type: "Одноразовая", 
    nicotine: 30, 
    price: 1490, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    description: "Элегантная одноразовая электронная сигарета в черном матовом корпусе. Стильный аксессуар для настоящих ценителей.",
    features: ["Матовое покрытие soft-touch", "Эргономичная форма", "Равномерная подача вкуса", "Защита от перегрева"],
    volume: "2.5 мл",
    puffs: 800
  },
  { 
    id: 4, 
    name: "Premium Starter Kit", 
    brand: "CloudKing", 
    type: "Набор", 
    nicotine: 20, 
    price: 2990, 
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800", 
    popular: true,
    description: "Полный стартовый набор для начинающих. Всё необходимое для комфортного старта в одной коробке.",
    features: ["POD-устройство", "2 картриджа в комплекте", "USB-зарядка", "Инструкция на русском", "Фирменный чехол"],
    volume: "1.5 мл (картридж)",
    puffs: 800
  },
  { 
    id: 5, 
    name: "Royal Mist", 
    brand: "VapeLux", 
    type: "Жидкость", 
    nicotine: 6, 
    price: 890, 
    image: "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800",
    description: "Премиальная жидкость для заправки с изысканным многогранным вкусом. Произведено из качественных компонентов.",
    features: ["Объем 30 мл", "Прозрачная бутылочка", "Защита от детей", "Градуировка объема", "Удобный дозатор"],
    volume: "30 мл"
  },
  { 
    id: 6, 
    name: "Platinum Series", 
    brand: "EliteVape", 
    type: "POD-система", 
    nicotine: 35, 
    price: 4290, 
    image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
    description: "Флагманская POD-система с передовыми технологиями. Максимальная производительность и долговечность.",
    features: ["Аккумулятор 1200 мАч", "Беспроводная зарядка", "OLED-дисплей", "Умная система контроля затяжки", "Металлический корпус"],
    volume: "3 мл (картридж)",
    puffs: 2000
  },
  { 
    id: 7, 
    name: "Golden Vapor", 
    brand: "CloudKing", 
    type: "Жидкость", 
    nicotine: 12, 
    price: 990, 
    image: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800",
    description: "Сбалансированная жидкость средней крепости. Идеальна для ежедневного использования.",
    features: ["Объем 50 мл", "Соотношение VG/PG 70/30", "Защитная пломба", "Контроль качества", "Срок годности 2 года"],
    volume: "50 мл"
  },
  { 
    id: 8, 
    name: "Elite Max", 
    brand: "EliteVape", 
    type: "Одноразовая", 
    nicotine: 50, 
    price: 1790, 
    image: "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=800",
    description: "Мощная одноразовая электронная сигарета с максимальным содержанием никотина. Для опытных пользователей.",
    features: ["Усиленная батарея", "Интенсивный вкус", "Увеличенный объем", "Антибактериальный мундштук"],
    volume: "3 мл",
    puffs: 1500
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Icon name="PackageX" className="mx-auto text-muted-foreground mb-4" size={64} />
          <h2 className="text-2xl font-bold mb-2">Товар не найден</h2>
          <Button onClick={() => navigate("/")} className="mt-4">
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Вернуться в каталог
          </Button>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartData = localStorage.getItem("vape-cart");
    const cart = cartData ? JSON.parse(cartData) : [];
    
    const existingItem = cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem("vape-cart", JSON.stringify(cart));
    
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} (${quantity} шт.) добавлен в корзину`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад в каталог
          </Button>
          <div className="flex items-center gap-3">
            <Icon name="Sparkles" className="text-primary" size={28} />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              VapeGold
            </span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Icon name="ShoppingCart" size={20} />
            Корзина
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border/50 shadow-xl">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.popular && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0 shadow-lg">
                  <Icon name="Star" size={14} className="mr-1" />
                  Популярное
                </Badge>
              )}
            </div>
            
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Icon name="Info" className="text-primary" size={20} />
                  Характеристики
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Бренд:</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Тип:</span>
                    <span className="font-medium">{product.type}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Никотин:</span>
                    <span className="font-medium">{product.nicotine} мг/мл</span>
                  </div>
                  {product.volume && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Объем:</span>
                        <span className="font-medium">{product.volume}</span>
                      </div>
                    </>
                  )}
                  {product.puffs && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Затяжек:</span>
                        <span className="font-medium">~{product.puffs}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg">{product.brand}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-primary">{product.price} ₽</span>
              <Badge variant="outline" className="text-sm">
                В наличии
              </Badge>
            </div>

            <Separator />

            {product.description && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Описание</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.features && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Icon name="CheckCircle" className="text-primary" size={20} />
                    Особенности
                  </h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Icon name="Check" className="text-primary mt-0.5 flex-shrink-0" size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Количество:</span>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Icon name="Minus" size={16} />
                  </Button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Итого:</span>
                <span className="text-2xl font-bold text-primary">{product.price * quantity} ₽</span>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                size="lg"
                onClick={handleAddToCart}
              >
                <Icon name="ShoppingCart" className="mr-2" size={20} />
                Добавить в корзину
              </Button>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="Truck" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold mb-1">Быстрая доставка</h4>
                    <p className="text-sm text-muted-foreground">Доставим в течение 2-3 дней по всей России</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Icon name="ShieldCheck" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold mb-1">Гарантия качества</h4>
                    <p className="text-sm text-muted-foreground">Только оригинальная продукция от производителя</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Icon name="CreditCard" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold mb-1">Удобная оплата</h4>
                    <p className="text-sm text-muted-foreground">Наличными или картой при получении</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
