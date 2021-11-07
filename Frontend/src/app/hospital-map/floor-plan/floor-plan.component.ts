import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room, RoomType } from '../models/rooms/room.model';
import { D3Service } from '../shared/d3.service';
import { RoomsService } from './rooms.service';


@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.css'],
  providers: [RoomsService]
})
export class FloorPlanComponent implements OnInit {
  buildingId: string = '';
  svg: any;
  rooms: Room[] = [];
  selectedFloor: any = 0;

  constructor(private d3Service: D3Service, private roomsService: RoomsService, private route: ActivatedRoute) {
    this.selectedFloor = 0;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.buildingId = params['buildingId'];

      this.roomsService.getRooms(this.buildingId).subscribe(
        data => {
          this.rooms = data;
          this.drawRooms();
        }
      );
    });
  }

  private drawRooms() {
    this.svg = this.d3Service.selectById('svg-floor');
    this.d3Service.drawPlainRectangles(this.svg, this.rooms, 'main-building-room');
    this.drawRoomNames();
    this.filterRooms();   
  }

  private filterRooms(): void {
    this.svg.selectAll('.main-building-room')
      .style('visibility', 'hidden');
    this.svg.selectAll('.floor-' + this.selectedFloor)
      .style('visibility', 'visible');
  }

  selectedFloorChanged(e: any): void {
    this.filterRooms();
  }

  drawRoomNames(): void {
    for (const room of this.rooms){
      this.d3Service.addText(this.svg, RoomType[room.type] + ' ' + room.name, { x: room.x + room.width/2, y: room.y + room.height/2 }, 'floor-' + room.floor + ' main-building-room');
    }
    this.svg.selectAll('text')
      .style('font-size', '14px')
  }

}
