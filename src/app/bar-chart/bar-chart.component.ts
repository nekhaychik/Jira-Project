import {Component, OnInit, AfterViewChecked, ViewChild, OnDestroy} from '@angular/core';
import {CrudService} from '../services/crud/crud.service';
import {CardStore, ListStore} from '../services/types';
import {ActivatedRoute, Params} from '@angular/router';
import {ChartDataset} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {Collection} from '../enums';
import {Subscription} from 'rxjs';

const BAR_CHAR_LABEL = 'Number Of Tasks';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective | undefined;
  private subscriptionList: Subscription[] = [];
  private boardID: string = '';
  public barChartLabels: string[] = [];
  public barChartLegend: boolean = true;
  public barChartData: ChartDataset[] = [{data: [], label: BAR_CHAR_LABEL}];

  constructor(private crudService: CrudService,
              private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.subscriptionList.push(
      this.route.params.subscribe((params: Params) => {
          this.boardID = params['id'];
          this.dataHandler(this.boardID);
        }
      )
    );
  }

  public ngAfterViewChecked(): void {
    if (this.chart) {
      this.chart.update();
    }
  }

  public dataHandler(boardID: string): void {
    let namesOfLists: string[] = [];
    let numbersOfTasks: number[] = [];

    this.subscriptionList.push(
      this.crudService.handleData<ListStore>(Collection.LISTS).subscribe((lists: ListStore[]) => {
        lists
          .filter((list: ListStore) => list.boardID === boardID)
          .forEach((list: ListStore) => {
            namesOfLists.push(list.name);
            let count = 0;
            this.subscriptionList.push(
              this.crudService.handleData<CardStore>(Collection.CARDS).subscribe((cards: CardStore[]) => {
                cards.forEach((card: CardStore) => {
                  if (card.listID === list.id) {
                    count++;
                  }
                });
                numbersOfTasks.push(count);
              })
            );
          });

        this.barChartLabels = namesOfLists;
        this.barChartData = [{data: numbersOfTasks, label: BAR_CHAR_LABEL}];
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
