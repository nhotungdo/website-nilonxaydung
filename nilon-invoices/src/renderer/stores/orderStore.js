import { create } from 'zustand';
import { mockOrders } from '../mock/data';
export const useOrderStore = create((set, get) => {
    let simulationInterval = null;
    // Synthesis alert sound using Web Audio API
    const playBrandChime = () => {
        if (!get().soundEnabled)
            return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx)
                return;
            const ctx = new AudioCtx();
            // Dual-tone cashier alert
            const now = ctx.currentTime;
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(587.33, now); // D5
            osc1.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880, now); // A5
            osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.4);
            osc2.stop(now + 0.4);
        }
        catch (e) {
            console.warn('Web Audio Playback blocked by browser policy or unsupported:', e);
        }
    };
    return {
        orders: mockOrders,
        soundEnabled: true,
        isSimulating: false,
        toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
        addOrder: (order) => {
            set((state) => ({
                orders: [order, ...state.orders]
            }));
            playBrandChime();
        },
        triggerChime: () => {
            playBrandChime();
        },
        startSimulation: () => {
            if (simulationInterval)
                return;
            set({ isSimulating: true });
            // Generate a new simulated order every 45 seconds
            simulationInterval = setInterval(() => {
                const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                const codeNum = Math.floor(10000 + Math.random() * 89999);
                const customerNames = [
                    'Nguyễn Thành Long (Đại lý Quận 12)',
                    'Công ty XD An Phong',
                    'Vật Liệu Xây Dựng Tiến Phát',
                    'Bùi Minh Trí (Thầu phụ biệt thự)',
                    'Trần Thị Mai (Đại lý phân phối)'
                ];
                const customerPhones = ['0908887766', '0912223344', '0933556677', '0978990011', '0944778899'];
                const products = [
                    { name: 'Nilon Lót Nền Khổ 2m (Dày 0.05mm)', price: 1800000, unit: 'Cuộn' },
                    { name: 'Bạt Sọc 3 Màu Che Nắng Mưa Khổ 4m x 50m', price: 2150000, unit: 'Cuộn' },
                    { name: 'Keo Dán Nilon Xây Dựng 5L', price: 1500000, unit: 'Thùng' },
                    { name: 'Màng PE Quấn Pallet Gạch 50cm', price: 180000, unit: 'Cuộn' },
                    { name: 'Dây thừng neo bạt phi 10mm', price: 950000, unit: 'Cuộn' }
                ];
                // Random select items
                const numItems = 1 + Math.floor(Math.random() * 3);
                const orderItems = [];
                let total = 0;
                for (let i = 0; i < numItems; i++) {
                    const item = products[Math.floor(Math.random() * products.length)];
                    const qty = 1 + Math.floor(Math.random() * 5);
                    orderItems.push({
                        name: item.name,
                        quantity: qty,
                        price: item.price,
                        unit: item.unit
                    });
                    total += item.price * qty;
                }
                const newOrder = {
                    id: orderId,
                    orderCode: `NLN-${codeNum}`,
                    customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
                    customerPhone: customerPhones[Math.floor(Math.random() * customerPhones.length)],
                    totalAmount: total,
                    paperSize: Math.random() > 0.15 ? 'K80' : 'K58',
                    pdfUrl: `https://api.nilonxaydung.vn/invoices/pdf/${orderId}`,
                    createdAt: new Date().toISOString(),
                    items: orderItems
                };
                get().addOrder(newOrder);
                // Also push a simulated printer queue job for this order!
                // We'll dispatch a custom event that queueStore can listen to or just let it query
                const event = new CustomEvent('simulated_order_arrived', { detail: newOrder });
                window.dispatchEvent(event);
            }, 45000);
        },
        stopSimulation: () => {
            if (simulationInterval) {
                clearInterval(simulationInterval);
                simulationInterval = null;
            }
            set({ isSimulating: false });
        }
    };
});
