import {Component, OnInit, AfterViewChecked, ViewChild, OnDestroy} from '@angular/core';
import {CrudService} from '../services/crud/crud.service';
import {CardStore, ListStore} from '../services/types';
import {ActivatedRoute, Params} from '@angular/router';
import {ChartDataset} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {Collection} from '../enums';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective | undefined;
  readonly subscription: Subscription = new Subscription();
  private boardID: string = '';
  public barChartLabels: string[] = [];
  public barChartLegend: boolean = true;
  public barChartData: ChartDataset[] = [{data: [], label: ''}];

  constructor(private crudService: CrudService,
              private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.subscription.add(this.route.params.subscribe(
      (params: Params) => {
        this.boardID = params['id'];
        this.dataHandler(this.boardID);
      }
    ));
  }

  public ngAfterViewChecked(): void {
    if (this.chart) {
      this.chart.update();
    }
  }

  public dataHandler(boardID: string): void {
    let namesOfLists: string[] = [];
    let numbersOfTasks: number[] = [];

    this.subscription.add(
      this.crudService.handleData<ListStore>(Collection.LISTS).subscribe((lists: ListStore[]) => {
        lists
          .filter((list: ListStore) => list.boardID === boardID)
          .forEach((list: ListStore) => {
            namesOfLists.push(list.name);
            let count = 0;
            this.subscription.add(this.crudService.handleData<CardStore>(Collection.CARDS).subscribe((cards: CardStore[]) => {
              cards.forEach((card: CardStore) => {
                if (card.listID === list.id) {
                  count++;
                }
              });
              numbersOfTasks.push(count);
            }));
          });

        this.barChartLabels = namesOfLists;
        this.barChartData = [{data: numbersOfTasks, label: 'Number Of Tasks'}];
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
