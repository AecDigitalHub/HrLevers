import { Component, OnInit, Input } from "@angular/core";
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

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  memberId: String;
  member: Observable<any>;
  task: any;
  editedTask: any;
  EmployeeSkills: any;
  PositionSkills: any;
  position: Observable<any>;
  topics: any;
  skillsgap: any;

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
      this.teamMember
      .getEmployeePosition(this.memberId)
      .subscribe(position => {
        this.position = position;
        console.log(this.position);
      });
      this.skill.getSkillsGap(this.memberId).subscribe(skillsgap => {
        this.skillsgap = skillsgap;
        console.log(skillsgap);
        this.skill.gettopics(this.skillsgap).subscribe(topics => {
          this.topics = topics;
          console.log(topics);
        });
      });
    });
  }

  newTask(Name, Description, Duedate, ActionPlan, form) {
    form.reset();
    this.route.params.subscribe(params => {
      this.ntask
        .newTask(Name, Description, Duedate, ActionPlan)
        .subscribe(data => {
          this.task = data;
          console.log(this.task);
          this.teamMember
            .getEmployee(this.memberId)
            .subscribe(res => (this.member = res));
        });
    });
  }
  removeTask(id) {
    this.route.params.subscribe(params => {
      this.ntask.removeTask(id).subscribe();
      this.teamMember
        .getEmployee(this.memberId)
        .subscribe(res => (this.member = res));
    });
  }
  editTask(id, Name, Description, Duedate, Done) {
    console.log(id, Name, Description, Duedate, Done);
    this.ntask
      .editTask(id, Name, Description, Duedate, Done)
      .subscribe(data => {
        this.editedTask = data;
        this.teamMember
          .getEmployee(this.memberId)
          .subscribe(res => (this.member = res));
      });
  }
}