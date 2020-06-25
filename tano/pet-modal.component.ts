import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IPet } from 'src/app/models/pet';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { PetService } from 'src/app/services/pet/pet.service';

const NAVBAR_HEIGHT = 56;

@Component({
	selector: 'app-pet-modal',
	templateUrl: './pet-modal.component.html',
	styleUrls: ['./pet-modal.component.scss'],
})
export class PetModalComponent implements OnInit {
	@Input() pet: IPet;

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private originX: number;
	private originY: number;
	private finalX: number;
	private finalY: number;

	constructor(
		private modalCtrl: ModalController,
		private petService: PetService,
	) { }

	ngOnInit() {
		let canvas = document.getElementById('canvas') as HTMLCanvasElement;
		let context = canvas.getContext("2d");
		context.lineCap = 'round';
		context.lineJoin = 'round';
		context.strokeStyle = 'black';
		context.lineWidth = 1;

		this.canvas = canvas;
		this.ctx = context;
	}

	likeIt() {
		this.petService.sendLikeTo(this.pet);
	}

	close() {
		this.modalCtrl.dismiss({
			'dismissed': true
		});
	}

	mouseDown(e) {
		this.startCalc(e.clientX, e.clientY);
	}

	mouseUp(e) {
		this.finishCalc(e.clientX, e.clientY);
	}

	touchstart(e) {
		this.startCalc(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
	}

	touchend(e) {
		this.finishCalc(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
	}

	private startCalc(originX, originY) {
		this.originX = originX;
		this.originY = originY - NAVBAR_HEIGHT;
		console.log(`Start at: ${this.originX},${this.originY}`);
	}

	private finishCalc(finalX, finalY) {
		this.finalX = finalX;
		this.finalY = finalY - NAVBAR_HEIGHT;
		console.log(`End at: ${this.finalX},${this.finalY}`);

		if ((Math.abs(this.originX - this.finalX) < 5) && (Math.abs(this.originY - this.finalY) < 5)) return;

		this.ctx.beginPath();
		this.ctx.moveTo(this.originX, this.originY);
		this.ctx.lineTo(this.finalX, this.finalY);
		this.ctx.lineWidth = 5;
		this.ctx.strokeStyle = 'blue';
		this.ctx.stroke();
	}
}
