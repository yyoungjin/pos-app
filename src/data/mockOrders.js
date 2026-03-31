export const ORDER_STATUS = {
  ORDERED: '주문',
  SERVED: '서빙완료',
}

export const mockOrders = [
  { id: 1, menuName: '국물 떡볶이', orderTime: '18:02', tableNumber: 'A-03', status: ORDER_STATUS.ORDERED },
  { id: 2, menuName: '치즈 닭꼬치', orderTime: '18:04', tableNumber: 'A-07', status: ORDER_STATUS.SERVED },
  { id: 3, menuName: '순살 후라이드', orderTime: '18:05', tableNumber: 'B-01', status: ORDER_STATUS.ORDERED },
  { id: 4, menuName: '오징어 버터구이', orderTime: '18:08', tableNumber: 'B-05', status: ORDER_STATUS.SERVED },
  { id: 5, menuName: '생맥주 500cc', orderTime: '18:09', tableNumber: 'C-02', status: ORDER_STATUS.ORDERED },
  { id: 6, menuName: '치킨 너겟', orderTime: '18:11', tableNumber: 'C-06', status: ORDER_STATUS.ORDERED },
  { id: 7, menuName: '매운 어묵탕', orderTime: '18:14', tableNumber: 'A-01', status: ORDER_STATUS.SERVED },
  { id: 8, menuName: '하이볼', orderTime: '18:16', tableNumber: 'B-03', status: ORDER_STATUS.ORDERED },
]
