import { Component, OnInit, Input } from "@angular/core";;
import { Observable } from "../../../node_modules/rxjs";
import { ActivatedRoute } from "@angular/router";
import { AllthreadsService } from "../../services/allthreads.service";
import { Http, Response } from "@angular/http";
import { AuthenticationService } from "services/authentication.service";
import { AllemployeesService } from "services/allemployees.service";
import { ExperiencesService } from "services/experiences.service";
import { TasksService } from "services/tasks.service";
import "rxjs/add/operator/map";
import { SkillsService } from "services/skills.service";

const _ = require('lodash');


@Component({
  selector: "app-team-member-profile",
  templateUrl: "./team-member-profile.component.html",
  styleUrls: ["./team-member-profile.component.css"]
})
export class TeamMemberProfileComponent implements OnInit {
  memberId: String;
  member: Observable<any>;
  task: any;
  editedTask: any;
  EmployeeSkills: any;
  PositionSkills: any;
  position: any;
  tasksprogress: any;
  skillsgap: any;
  topics: any;

  constructor(
    private skill: SkillsService,
    public ntask: TasksService,
    public teamMember: AllemployeesService,
    public Experiences: ExperiencesService,
    private route: ActivatedRoute,
    private Auth: AuthenticationService
  ) {}


  ngOnInit() {
    this.route.params.subscribe(params => {
      (this.memberId = params["id"]),
        this.teamMember
          .getEmployee(this.memberId)
          .subscribe(res => (this.member = res));
    });
    this.route.params.subscribe(params => {
      (this.memberId = params["id"]),
        this.skill.getEmployeeSkills(this.memberId).subscribe(skills => {
          this.EmployeeSkills = skills.employeeLevel;
          this.PositionSkills = skills.positionLevel;
        });
        this.skill.getSkillsGap(this.memberId).subscribe(skillsgap => {
          this.skillsgap = _.uniq(skillsgap);
          console.log(skillsgap);
          });
      this.teamMember.getEmployeePosition(this.memberId).subscribe(position => {
        this.position = position;
        console.log(position);
      });
      this.teamMember.getTasksProgress(this.memberId).subscribe(tasksprogress => {
        this.tasksprogress = parseFloat(tasksprogress.toFixed(2));
        console.log(this.tasksprogress);
      });
    });
  }

  newTask(Name, Description, Duedate, ActionPlan, form) {
    
    form.reset();
    // this.route.params.subscribe(params => {
      this.ntask.newTask(Name, Description, Duedate, ActionPlan).subscribe(data => {
          this.task = data;
          this.teamMember.getEmployee(this.memberId).subscribe(employee => {
              this.member = employee;
              this.teamMember.getTasksProgress(this.memberId).subscribe(tasksprogress => {
                this.tasksprogress = (tasksprogress.toFixed(2));
                console.log(this.tasksprogress);
              });
        });
    });

}

  removeTask(id) {
    this.route.params.subscribe(params => {
      this.ntask.removeTask(id).subscribe(() => {
        this.teamMember
        .getEmployee(this.memberId)
        .subscribe(res => {
        (this.member = res);
        this.teamMember.getTasksProgress(this.memberId).subscribe(tasksprogress => {
          this.tasksprogress = (tasksprogress.toFixed(2));
          console.log(this.tasksprogress);
        });
      });
    });
  });
}

  editTask(id, Name, Description, Duedate, Status) {
    console.log(id, Name, Description, Duedate, Status);
    this.ntask
      .editTask(id, Name, Description, Duedate, Status)
      .subscribe(data => {
        this.editedTask = data;
        this.teamMember.getEmployee(this.memberId).subscribe(employee => {
          this.member = employee;
          this.teamMember.getTasksProgress(this.memberId).subscribe(tasksprogress => {
            this.tasksprogress = (tasksprogress.toFixed(2));
            console.log(this.tasksprogress);
          });
        });
      });
  };
};



