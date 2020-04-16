export class MilkAttendace {
  constructor(public milkIn: Date,
              public litres: number,
              public price: number,
              public user: string,
              public id?: string
              ) {}
}

export class WaterCans {
  constructor(public waterIn: Date,
              public cans: number,
              public price: number,
              public user: string,
              public id?: string
             ) {}
}
