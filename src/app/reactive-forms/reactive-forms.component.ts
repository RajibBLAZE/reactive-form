import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { states } from '../services/data/states';
@Component({
  selector: 'app-reactive-forms',
  templateUrl: './reactive-forms.component.html',
  styleUrls: ['./reactive-forms.component.css']
})
export class ReactiveFormsComponent implements OnInit {
  genders: string[] = ['Male', 'Female']; 
  state = states;
  rForm!: FormGroup;
  isLoading: boolean = false;
  displayForm: any = {};
  submitForm: any[] = [];

  constructor() { }
  get hobbyControls(){
    return (<FormArray>this.rForm.get('hobbies')).controls;
  }

  ngOnInit(): void {
    this.rForm = new FormGroup({
      
      'username': new FormControl('', Validators.required),
      'email': new FormControl('',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      'gender': new FormControl(''),
      'state': new FormControl('',Validators.required),
      'hobbies': new FormArray([])
    });
    this.rForm.valueChanges.subscribe(value => {
      this.displayForm = { ...value }; // Update dynamically
    });
    // this.rForm.valueChanges.subscribe(value =>{
    //   console.log(value);
    // });
    // this.rForm.setValue({
    //     username: "rajib",
    //     email: "rajib@blaze.com",
    //     gender: "Male",
    //     hobbies: []

    // });
  //   this.rForm.patchValue({
  //     username: "rajib",
  //     email: "",
  //     gender: "Male",
  //     hobbies: []

  // });
  }
  onSubmit(){
    if(this.rForm.valid){
      this.isLoading = true;
      
      
      setTimeout(()=>{
        this.submitForm.push({ ...this.rForm.value });
        console.log("form Submitted:", this.rForm.value);
        this.rForm.reset();

        this.displayForm = {};
        this.isLoading = false;
      },100);
      

    }
    // console.log(this.rForm);
    // this.rForm.reset()// to reset the form
  }
  onAddHobby(){
    const control = new FormControl('', [Validators.required]);
    (<FormArray>this.rForm.get('hobbies')).push(control);
    this.rForm.get('hobbies')?.valueChanges.subscribe(value => {
      this.displayForm.hobbies = value;
    });
  }

  onEdit(index: number){
      const data = this.submitForm[index];
      this.rForm.patchValue({
        username: data.username,
        email: data.email,
        state: data.state,
        gender: data.gender,
        hobbies: data.hobbies
        
      });
      this.submitForm.splice(index, 1);
  }

  onDelete(index: number){
    this.submitForm.splice(index, 1);
  }


  getValidationMessage(controlName: string): string {
    const control = this.rForm.get(controlName);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) return `${controlName} is required`;
    if (control.hasError('email')) return 'Please enter a valid email';
    if (control.hasError('minlength')) return `Minimum length is 3 characters`;

    return '';
  }
}
