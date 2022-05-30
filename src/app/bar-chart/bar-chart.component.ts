import {Component, OnInit, AfterViewChecked, ViewChild} from '@angular/core';
import {CrudService} from '../services/crud/crud.service';
import {CardStore, ListStore} from '../services/types';
import {ActivatedRoute, Params} from '@angular/router';
import {ChartDataset} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {Collection} from '../enums';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, AfterViewChecked {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  private boardID: string = '';
  public barChartLabels: string[] = [];
  public barChartLegend = true;
  public barChartData: ChartDataset[] = [{data: [], label: ''}];

  constructor(private crudService: CrudService,
              private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.boardID = params['id'];
        this.dataHandler(this.boardID);
      }
    );
  }

  public ngAfterViewChecked(): void {
    this.chart?.update();
  }

  public dataHandler(boardID: string): void {

    let namesOfLists: string[] = [];
    let numbersOfTasks: number[] = [];

    this.crudService.handleData<ListStore>(Collection.LISTS).subscribe((lists: ListStore[]) => {
      lists
        .filter((list: ListStore) => list.boardID === boardID)
        .forEach((list: ListStore) => {
          namesOfLists.push(list.name);
          let count = 0;
          this.crudService.handleData<CardStore>(Collection.CARDS).subscribe((cards: CardStore[]) => {
            cards.forEach((card: CardStore) => {
              if (card.listID === list.id) {
                count++;
              }
            });
            numbersOfTasks.push(count);
          });
        });

      this.barChartLabels = namesOfLists;
      this.barChartData = [{data: numbersOfTasks, label: 'Number Of Tasks'}];

    });
  }
}
