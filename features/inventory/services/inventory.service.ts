// features/inventory/services/inventory.service.ts
import {
  InventoryItem,
  ProductCategory,
  Department,
  ProductStatus,
  FilterOption,
} from '../data/interfaces/inventory.interface';

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    // const response = await axios.get('/api/inventory');
    // return response.data;
    return [
      {
        id: '1',
        barcode: 'TEC-001',
        name: "MacBook Pro 16''",
        category: ProductCategory.TECHNOLOGY,
        department: Department.COMPUTING,
        quantity: 5,
        status: ProductStatus.AVAILABLE,
        description: 'MacBook Pro con chip M1 Pro, 16GB RAM, 512GB SSD',
        imageUrl:
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEBAQERAVFRIQEBAREBUWEBgQEBASFRIWFhURFxUYHSggGRolGxcVITEhJSkvLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGzcmHyUtLi0tLS0tMi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABAUCAwcGAQj/xABQEAACAQIBBQoJBwkECwAAAAAAAQIDEQQFEiExQQYXUVRhcZGh0dIHExYigZOUs9MUMlJTdLHBJDM1NkJicnPwNISy4RUjJUNEVWSCg5Ki/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAIDBAEFBv/EADIRAQACAQIEBAMHBQEBAAAAAAABAhEDEgQTIVExMkGBBWGhFCIzQnHR4RVSgpGxwfD/2gAMAwEAAhEDEQA/AO4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACj3Q7rsFgXFYvEwpymrxi7ym19LNim7cpzLsQpN9nJHHV6mr3Bl3ab7OSOOr1NXuDJtN9nJHHV6mr3Bk2m+zkjjq9TV7gybTfZyRx1epq9wZNpvs5I46vU1e4Mm032ckcdXqavcGTab7OSOOr1NXuDJtN9nJHHV6mr3Bk2m+zkjjq9TV7gybTfZyRx1epq9wZNpvs5I46vU1e4Mm032ckcdXqavcGTab7OSOOr1NXuDJtN9nJHHV6mr3Bk2m+zkjjq9TV7gybVrkDdxk/G1PFYbFwnUs2oWlCbS1tKaV/QMubXojrgAAAAAAAAAAAPzzux3P/6S3S43DTrOmqdGnKMszxllGlS82za0Xm2U6mpsrn5rqae+0R8m7eThx+Xs675R9r+S/wCyfNkvAjDj8vZ13zv2r5OfZfm+T8CUEm/l8tCb/s62L+MTxUxGcORwvXxVa8FMLpPGSX/gXfMMfF5/s+v8NH9Oj0t9FjS8DFKSusoS9nXfLo+JZ8I+qieEx4yzfgShx6fsy753+oWj8v1/hz7NH9xvJw4/P2Zd8f1Cf7fqTw3zfX4E6f8AzCXsy+IJ+IY/L9XI4b5tb8C1Pj8vZ13yP9Sn+36/wl9k+bKn4FKb0fL5L+7Lvko+I5/L9XJ4XHqyqeBKCv8Al8tC4uu+J+ITH5fqV4bPqpYeC+DqxpPFyvLW/ErQ7v8Af5ukU+ITafL9WufhkRSbbvp/K0j4GIO/5dKydv7Ou+XRxcz6M08JEerVR8D0JSaWNlZbfk675GONmZxhOeCiIzu+jbU8DEF/x0vZ13yX2ueyMcHE+qvn4KoJz/LJWgo/7haZS1R+fzdIji5xM4aI+GRMR97x+TRgNzX+jsrZHcK7n47FQ05mZZKpGLWt3upMlocRzomcYwy8Rw0aF4jOX6bNbGAAAAAAAAAAADiuG/W/KP2Ze7w5l4jye7Vw/n9nRUjC3M0iSMyzUTsQhMvN4ujmzlBp3jqdtcdjPF1dKaWmrdS+Yz3YU4W+bP8AD7yvrCc9fGEqOIrLbcsjVvCrl6cvk8dVuns2q2wc2zsaVPBlSyi0/PXmt2vwEo1e6M6MTH3VjBqSzou6L4xMZhnnMTiWMnYjM4diMsq1Xzb8KOXt0K16vLU6d8YpbIwbf3HeGl6Vpxo4egrTzaXLbrZ6EzijBWN1zJNG0bvWyGnHRLXt1Z452RZhzSjMqHMvGXLVfT82/otc5fpSXoZxMfp/LzO7KFsr5AX/AFEffUy7gYxW3s8XjZzqRP6u6HpPOAAAAAAAAAAABxXC/rflH7MvdYczcR5Pdq0PP7OjpGFslsiiUIy2xiSiEJlHyhgfGRTi0qkfmN6nwxlyPqIa2hGpX5paWrsnr4KalQu5K2bUh8+D186e1cp5VtG0Tj1a7XxET4xPhLZGNtV1wrYV4w5nLCpPhV+bQ/8AMjKVXyOZNOz08G3oHTDsxaso3jpU6l1oTVnwMhGpNZzCzZF6YlKWJbk4Nac1Sv6dROdSZnCrlxEbofMbVsrcC0nLz6O6Vc9Vbkl3z6v05Wj/AArV1m3Rpthdr+ley0xcrxS5UardYwz6cYnKXhp2ikWV8Fd65lHxtQ7C3TqqciPP07Iym3/E27LofWijUvmMNfExs93ld2dS+Wsh8mJj76maeAnMW9nkcbXE093dj1HmAAAAAAAAAAAA4thf1vyj9lj7rDmbiPJ7tOh5/Z0iKMTZLbFEoQltiiyFcy0YvKFOnolLzvorzpdC1ekhfVrTxlZp6Gpqdax07+iiyrj/ABjjOnHMnT0wk350ltg0tFnzsxa2tF/CPdv0eH2Zi05ifT/1lHGKtCMr2k1p2aVrTMepOVfLnTtMI1elotnc2naUTKytlTVbUtZzLXWYmE2M7pXd+V9pVZCK9eiRhqyz5yexJcOpcnpLKx1yjek7YrCn3SY15qjF6ajs+RbfwNGhXNsy0cPpYnM+ibgY5tOEVsSXQbas9+tplOpothU3utZE0duVfjsS7WSvJ6Ira32C14pGZaNKnXr4JGFoKhRUf2raeWT1sxWtiOvija3O1M+jwe6f9MZD5cTH31M3fDfLf2YPiXnr7u+nrvIAAAAAAAAAAABxbCfrflH7LH3WGM3EeT3adDz+zpMTHDXLY5KKcpNJJXbbskuEl4dZQxMziHn8p5dcvNptxhwrRUnzbYrr5tRk1eJ9KvS0OCx1v1n6R+//ABV0IylqWbt5ecy9ZbLzWvzS6dBbXpJdPVRN59EXEWhJpPRNZy5JrX0q3WU6uJ8HYibeLCli76LlFoctp4acYs5XWtaSEThPT6SYeLejh1E9uV+cdU5Q8XnJfsq8nsbtqLIjHRnmd+JVWVEpVqaWp9V3p6kX16V6L9PMUnK2p03qT6SVbWZ7bfWG+EJ8nQ+0tjUv2VzND5PJ65aOS34nd95N9I8IbaUIQ0rXtd7vpK7ThG02t4o9WrnN8CM1rL612w8Pumd8s5D+0w99TPU+FTmt/Z5nxKMWp7u+nsvIAAAAAAAAAAABxSjVjHddlFykor5LHS2or81h9rMvEzEU692rh6za+IjPR7rEZcow1NzfBBX/APrV1nnW4ilfn+j1KcHq28YxHz/+yosdlKpXfnNQgndRTv6W9r/qxk1NW+p49Ieho8Np6Ph1nuiU6kYt5t5y4dfXsKoxC+a2t49IbozqPao9bO/elCY04+bdTwyfz6jfpshFO8q7akx5a4YZQpQjC8VpjKPW7P7xasYRpa8z1QE3fQVSsmEiUHGlNvW1bpdinMTZDxtCVgKObFTev9lcL4S6EdS+Z2x7t1RXT4NcuFkohCJ6qRO9Vv6Kt6dXaWzHTDZPSsLCE3sbXWIhTOPWEqhiprXZ9RZE2hVbSpPg3Tygl+z1X+4nzPkrjh5n1Q6uNznmxWnm1Ge98tFNHb1llKSSsZrWdiJmXkN09BxyvkFvXLExduBeOp2Pb+F6c007TPrh4/xK8W1KxHpl3s9d5IAAAAAAAAAAAPz5ulqOO6fKDX1NP3NA8/j4zpe71fhX4/8Aj+yy8fJ8P/szyNsPo909mylCT2dPnfeMQbpTIxlwncQg2wvwjCKVSZxGUrEYGcqM5tWio52nW7adCOWicZZ+dSLxXxlHwmG0XMF7TM4SvdhiXnSjTWx50vwX39R2lfV2vSJl9r4xRebHS9XMaa1dppTaMy04itmxu3zl8UhZSuZVVGtK3Bnu+q7ts/rlJbWzlwlYeNSOqMpLX5yzV0nZhVfl29UmWL2LXwLzutFVtWIVRpMoZ89GrrZXOtnpDuK1SI01BWRVae6uZm0pmT8K5NTkvNXzV9J8PMW8Nozed9vD0U6+rFY218XlN3P6ayB9pXvqZ73C+WXicV5odvNzAAAAAAAAAAAAD8+bpJJbqMe39TT9zQPP+Ifhe71vhP4/+P7LZYmK4Dxol9HLdRxGd838Eul6Du6IQnCxp4Oo9aS/7k11HIvEqp1aJdLJv0qiXMr9bsJvEKba8/lha4SjShpUc58MtL7EcjVhk1Lat/Gcfo35Srp0Kv8ALn/hZ2+purhTo6cxqV/V5+eKUINvVpZkimZelFN0qnDTlNym3ZN3fYX4iOjRNYjoyVS13FaeFllU9ueko1eTm1G706+RbS2JWViK9WcJxvaCUtjk/mrmX7T6iGrqRUtNvVOw9Hhd/wCuAx21Jt4qrWx4JkKEUc6KZvZsVRLRFXb0JJXbEX64iEdsz1lMwuTW/Oq+iPe7DXpcLM/e1P8AX7qNTiIj7tP9rI3Mrn27j9NZA+0r31M28L5ZYOL80O3G5hAAAAAAAAAAAB+cd3Dtukx/8ul7iiYOO/C93q/C/wAf/H9mVJttLlPGw+ierhh4QhFZqcrbdK6CrM5URNpnx6NU66pvzZSpvk86HR/kT258U9k2jrGf+pOHyy7+coVF+61GfQcnTU30u2YXOFyjRqaIycZfRloIzXDLaNSvm6wZQjONOd3ocZJW1O6siM1mJhZp2paYw8xlTFXmqa1Rtncr4CenXplu0q9Ms4SVlrfJqQx1TxL5Vba06EthKEqxESrXiM68VoV/OfCkTtbbHzXdK/qsMFJaEvQlr6DLas2U2nHVd4fA1paqUlyyWZ/isI4XVt4QyX4jSr4z/wCrCjkOT/OTS5I6X0svrwE/nn/TPbjax5I/2scPhIU/mx07W9Mn6TZp6NNOPuwy31b6nmlskTchgHXP93H6ayB9pXvqZt4XyywcX5oduNzCAAAAAAAAAAAD84buv1kx/wDLpe4omHjfwvd6vwv8f/H9m3J+mcec8ja+jiMvSV8SopyuvNXDtK4r1RrSVS8VnvY/SWxGF8VwwzVt0dYmRjKuo/MducjEIWrE+K3oboKvi/FNKSTTTbbtwei+y5y1emGb7JWLboRqVNXcpO7bu+VkZn0ho+UN1SuktHoORUiEPG4q0LcOjlfCyzGOqyIiOq33GbnPlEXWq3VHOailolVadnp2RvovtLdPQ3/es83jONmk7aeP/Hv8Lg6dJWpU4wX7sUm+d636TXFYr4Q8i17XnNpyzlISRDVJkU4a5MjKcNbOJPgdc/3cfprIH2le+pm3hfLLBxfmh243MIAAAAAAAAAAAPzT4RptbosdZaXCil6iiZeJiJp17vU+Gfj+37N2CjJK+tnk2w+opXEGJxDeg7WsO5KV0r7CNsTLuW+ritCS9JyKOI06jf8AWsnFcONuG16E2+CN23z2IWd6J8FU1vRyPsK+h0Y1sRp5iUQYSMgZFqY6slpjRpteNnyfQjwyfVr4L20090/Jj4rio0q9PH0dZo0owjGEIqMYRUYpKySSskjU8CczOZJM4lENcmRShrZxOGtkUoYsJPlgOf7t1/trIH2le+pm3hfLLBxXmh243MIAAAAAAAAArcXlqlSlKNVTgo28+VN+KldJ6JrRyaSE3iPFOtJtHRpW6fCvVXi+bSR51U+RdxjwhbkJ43KWIxdCth/F1fFZufWnTms2lCDTSg9sXtOc2qXJv6PPb3OJ+vw3tVX4Y5lDlavf6vm9zifr8L7TV+GOZQ5Wr3+pvc4n6/C+1VfhjmUOVq9/qb3GJ+vwvtNX4Y5lDlavd93uMT9fhfaqvwxzKHL1e/1fY+DnErViMKv71V+GOZQ5eq+Q8HeKd/8AXYbQ7acXNX5VeGocyhytXunYXwbTsvGV6OdfTm415rV+WF9Q5lDl6ncn4Oaqi1TxNK9lm3xzUb3ec2lDgt0cuhzKuTo3lEqeD/GJX+UYd6VqxtRvTttmnebQ5F33e+xfGsP7XW+GOZRzk3N77F8aw/tdb4Y5lHeTd83vsXxnD+11vhjm0OTc3vsXxnD+11vhjmUOTc3vsXxnD+11e4c5lDkXN77F8Zw/tdXuDmUORdY7mdw9ejjsJia1fDuFDEUqkrYipOWbGSbzU4a9A5lSNG7ur3S4XbWR3nVc5F2dDL9Go4qln1c6Si3TpuUYXdrylqSXOSi8T4IzpzHitCasAAAAAAAAg4zI9Cr+cowlzwRzES7FphAe4/A8Vp9FjmyvZLfbu+eR2B4rDr7Rsr2OZbueR2B4rDr7Rsr2OZbueR2B4rDr7Rsr2OZbueR2B4rDr7Rsr2N9u55HYHisOvtGyvY327nkdgeKw6+0bK9jfbueR2B4rDr7Rsr2OZbueR2B4rDr7Rsr2OZbueR2B4rDr7Rsr2N9u55HYHisOvtGyvY5lu55HYHisOvtGyvY327nkdgeKw6H2jZXsb7dzyOwPFYdfaNlexvt3ffI7A8Vh19o2V7G+3c8jsDxWHX2jZXscy3c8jsDxWHX2jZXscy3d9W5DA8Vp9Fxsr2OZbumYTImHpfm6FOPNBHcRCM2mfVYJHXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//9k=',
        cost: 2499.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        barcode: 'TEC-002',
        name: "Monitor Dell UltraSharp 27''",
        category: ProductCategory.ELECTRONICS,
        department: Department.COMPUTING,
        quantity: 8,
        status: ProductStatus.AVAILABLE,
        description: 'Monitor 4K IPS con USB-C',
        imageUrl:
          'https://compuzone.com.ec/images/thumbs/0020689_monitor-dell-24-p2422h-full-hd-ips-60hz-hdmi-vga-dp-usb.jpeg',
        cost: 549.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        barcode: 'TEC-003',
        name: 'Arduino Starter Kit',
        category: ProductCategory.ELECTRONICS,
        department: Department.ELECTRONICS,
        quantity: 15,
        status: ProductStatus.IN_USE,
        description: 'Kit completo para principiantes con Arduino UNO',
        imageUrl:
          'https://store-usa.arduino.cc/cdn/shop/files/starterkit_02.unbox_934x700.jpg?v=1737973207',
        cost: 89.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        barcode: 'TEC-004',
        name: 'Raspberry Pi 4',
        category: ProductCategory.TECHNOLOGY,
        department: Department.COMPUTING,
        quantity: 10,
        status: ProductStatus.AVAILABLE,
        description: 'Raspberry Pi 4 Model B, 8GB RAM',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0nyePwk6Cz2lvSC8W1vOPVXem2GQ6BSjx6w&s',
        cost: 75.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        barcode: 'TEC-005',
        name: 'Microscopio Digital',
        category: ProductCategory.TOOLS,
        department: Department.ELECTRONICS,
        quantity: 3,
        status: ProductStatus.MAINTENANCE,
        description: 'Microscopio digital USB con amplificación 1000x',
        imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_801165-MEC74620640516_022024-O.webp',
        cost: 199.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6',
        barcode: 'TEC-006',
        name: 'Impresora 3D Creality',
        category: ProductCategory.TECHNOLOGY,
        department: Department.DESIGN,
        quantity: 2,
        status: ProductStatus.IN_USE,
        description: 'Impresora 3D Creality Ender 3 V2',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTQBdD1bTD-NC4Xv9mv-ZPd7oBEY_TFehifQ&s',
        cost: 279.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '7',
        barcode: 'TEC-007',
        name: 'Tableta Gráfica Wacom',
        category: ProductCategory.TECHNOLOGY,
        department: Department.DESIGN,
        quantity: 5,
        status: ProductStatus.AVAILABLE,
        description: 'Tableta gráfica Wacom Intuos Pro Medium',
        imageUrl:
          'https://i5.walmartimages.com/seo/Wacom-Intuos-Pro-Digital-Graphic-Drawing-Tablet-for-Mac-or-PC-Small-PTH460K0A_61e5f82e-5e54-4029-aeb6-c8b515c63acb.a83bb52d42839218aa3a0dec43f9db03.jpeg',
        cost: 349.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8',
        barcode: 'TEC-008',
        name: 'Set de Herramientas Electrónicas',
        category: ProductCategory.TOOLS,
        department: Department.ELECTRONICS,
        quantity: 6,
        status: ProductStatus.AVAILABLE,
        description: 'Kit completo de herramientas para electrónica',
        imageUrl:
          'data:image/jpeg;base64,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1G+wIC+gCAIAgCAIDnvKPs4Khrm3sH2c11r5ZG9fkI9RKyr86e7xF0fU09O1dV4b6rocKq8GnieWvgfccQ0uB8ocBYhaEL65rKaPLPT2weMMpbRyH/Cf6DvgrOyHdFPCs7MGgm+wl/y3/BPFh3RCqm/RlbMGqnDSml743D1kBVeorX7kX4ezsy+3ZmtO6mk9Q9pVeLq9yJ4W3sVO2Urj/wAM70o/e5V4yn3ErSW9iTQbK1YcQ+EsBZI0OzRusSwjxQ+5uLjvCnjafcTwd3Yrqdka2RxIiDRoGgyR6NaA1gNnHc0Adyo9fT3LcDd2IlXsXXDQRA9j4/e5R5hR7iVobux5DsjWsb0qd5v9XK7+klXjrKX+4rLS2rqiPiWztWGj82lv+4T6wr8RV3RThrW+USxDsnW6fmztessHtcq8XSv3IutFc/2kyp2WrANKZ9/JlPvU8VS/3IrwlvtILdka0m5hy/vPjH3lSWtoj+46w2dqZdImQZsXWhn6Npv+0Z8VVbQo9xL2deuTRaOw1d9kP8yP4px9HuI8vv7FUexlb9j/ADxfiU+YUe4h6C5ehIotm6yKQOdRl9twD2aHgQWuKutbS/3FXoruxXNspV1EhL4ubaTqXlotc62A1ce5crdfTBZydadBbJ4a5H0LshQBsOYt8a1rj6I3e9U2fW1BzfVldoWKVm6uiMrLhcDvGgid2xsPtC0DwExAEAQBAEAQBAW54WvBa4Ag7wVWUFJYZMZOLyjBVWy0Tjdpc3vuPWL+tZ1mzK5c45R769pWx5PmWWbJgb5D6vgua2Wvczo9pyfoi6NlY/rP87fwq62ZDuyvmVnZFX5LRcXP87fwqfLKvuV8yt+x6Nloet/pD8KeV0/cjzK77FY2Yh/X9IfBW8sp+5HmN32H5MQb+l6SlbNpXceY39/+ir8mYOp3pFPLaOxHmF/cpfsxAdwcD+98VD2ZQ/QlbRvXqRTsqODyO23wXB7Jh6M7eZz9UW6jZLMLc56lD2Su5eG1XF53R+RrC0AvdcdWX8KnymHqyPN7M8kip+yDToXu7rfBT5TDuyFtWxc8I8j2Ip7WcZD/ABD3NXSOyqV1yHtjUZ5YJLdkqcC3T0/W/wBlbyuj7nJ7U1Decr/gHZOD9f0h8FXyun7jzO/7FH5Iw9b/AEm/hUeVVfct5rf9ikbIRfWf52/hVfKau7J81u+xeotlIGG5DneRxFvMAF0q2ZTB56lLdpXTWOhnWtstFLHQzypSAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAID//2Q==',
        cost: 129.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return [];
  }
};

// Simulación de llamada a backend
const mockCategories = (): FilterOption[] => [
  { id: 1, name: 'Tecnología' },
  { id: 2, name: 'Electrónica' },
  { id: 3, name: 'Muebles' },
];

const mockDepartments = (): FilterOption[] => [
  { id: 1, name: 'Computación' },
  { id: 2, name: 'Electrónica' },
  { id: 3, name: 'Diseño' },
];

const mockStates = (): FilterOption[] => [
  { id: 1, name: 'Disponible' },
  { id: 2, name: 'En uso' },
  { id: 3, name: 'Mantenimiento' },
  { id: 4, name: 'Dañado' },
];

export class InventoryFilterService {
  static async getCategories(): Promise<FilterOption[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockCategories()), 500);
    });
  }

  static async getDepartments(): Promise<FilterOption[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockDepartments()), 500);
    });
  }

  static async getStates(): Promise<FilterOption[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockStates()), 500);
    });
  }
}