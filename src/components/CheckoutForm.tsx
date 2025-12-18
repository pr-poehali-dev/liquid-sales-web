import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";

type CheckoutFormProps = {
  cartTotal: number;
  onSubmit: (data: OrderData) => void;
  onBack: () => void;
};

export type OrderData = {
  name: string;
  phone: string;
  email: string;
  deliveryType: string;
  address: string;
  comment: string;
  paymentMethod: string;
};

const CheckoutForm = ({ cartTotal, onSubmit, onBack }: CheckoutFormProps) => {
  const [formData, setFormData] = useState<OrderData>({
    name: "",
    phone: "",
    email: "",
    deliveryType: "courier",
    address: "",
    comment: "",
    paymentMethod: "card",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderData, string>>>({});

  const deliveryPrice = formData.deliveryType === "courier" ? 300 : 0;
  const total = cartTotal + deliveryPrice;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OrderData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Введите имя";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Введите телефон";
    } else if (!/^[+]?[\d\s()-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Некорректный формат телефона";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Некорректный email";
    }
    if (formData.deliveryType === "courier" && !formData.address.trim()) {
      newErrors.address = "Введите адрес доставки";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof OrderData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button type="button" variant="ghost" size="icon" onClick={onBack}>
          <Icon name="ArrowLeft" size={20} />
        </Button>
        <h2 className="text-2xl font-bold">Оформление заказа</h2>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="User" className="text-primary" size={20} />
            Контактные данные
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Иван Иванов"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="example@mail.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Truck" className="text-primary" size={20} />
            Доставка
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.deliveryType}
            onValueChange={(value) => updateField("deliveryType", value)}
          >
            <div className="flex items-center space-x-3 border border-border/50 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors">
              <RadioGroupItem value="courier" id="courier" />
              <Label htmlFor="courier" className="flex-1 cursor-pointer">
                <div className="font-semibold">Курьером</div>
                <div className="text-sm text-muted-foreground">Доставка по адресу — 300 ₽</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 border border-border/50 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                <div className="font-semibold">Самовывоз</div>
                <div className="text-sm text-muted-foreground">Бесплатно</div>
              </Label>
            </div>
          </RadioGroup>

          {formData.deliveryType === "courier" && (
            <div>
              <Label htmlFor="address">Адрес доставки *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Улица, дом, квартира"
                rows={3}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="CreditCard" className="text-primary" size={20} />
            Способ оплаты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => updateField("paymentMethod", value)}
          >
            <div className="flex items-center space-x-3 border border-border/50 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="font-semibold">Картой онлайн</div>
                <div className="text-sm text-muted-foreground">Visa, MasterCard, МИР</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 border border-border/50 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex-1 cursor-pointer">
                <div className="font-semibold">Наличными</div>
                <div className="text-sm text-muted-foreground">При получении</div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageSquare" className="text-primary" size={20} />
            Комментарий к заказу
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.comment}
            onChange={(e) => updateField("comment", e.target.value)}
            placeholder="Укажите дополнительную информацию для курьера"
            rows={3}
          />
        </CardContent>
      </Card>

      <Card className="border-primary/50 bg-card/50">
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Товары:</span>
            <span className="font-medium">{cartTotal} ₽</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Доставка:</span>
            <span className="font-medium">{deliveryPrice === 0 ? "Бесплатно" : `${deliveryPrice} ₽`}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Итого:</span>
            <span className="text-2xl font-bold text-primary">{total} ₽</span>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        <Icon name="CheckCircle" className="mr-2" size={20} />
        Подтвердить заказ
      </Button>
    </form>
  );
};

export default CheckoutForm;
