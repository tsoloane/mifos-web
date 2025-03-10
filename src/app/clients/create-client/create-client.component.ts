/** Angular Imports */
import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/** Custom Services */
import { ClientsService } from '../clients.service';

/** Custom Components */
import { ClientGeneralStepComponent } from '../client-stepper/client-general-step/client-general-step.component';
import { ClientFamilyMembersStepComponent } from '../client-stepper/client-family-members-step/client-family-members-step.component';
import { ClientAddressStepComponent } from '../client-stepper/client-address-step/client-address-step.component';

/** Custom Services */
import { SettingsService } from 'app/settings/settings.service';


/**
 * Create Client Component.
 */
@Component({
  selector: 'mifosx-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent {

  /** Client General Step */
  @ViewChild(ClientGeneralStepComponent, { static: true }) clientGeneralStep: ClientGeneralStepComponent;
  /** Client Family Members Step */
  @ViewChild(ClientFamilyMembersStepComponent, { static: true }) clientFamilyMembersStep: ClientFamilyMembersStepComponent;
  /** Client Address Step */
  @ViewChild(ClientAddressStepComponent, { static: true }) clientAddressStep: ClientAddressStepComponent;

  /** Client Template */
  clientTemplate: any;
  /** Client Address Field Config */
  clientAddressFieldConfig: any;

  /**
   * Fetches client and address template from `resolve`
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {ClientsService} clientsService Clients Service
   * @param {SettingsService} settingsService Setting service
   */
  constructor(private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private settingsService: SettingsService) {
    this.route.data.subscribe((data: { clientTemplate: any, clientAddressFieldConfig: any }) => {
      this.clientTemplate = data.clientTemplate;
      this.clientAddressFieldConfig = data.clientAddressFieldConfig;
    });
  }

  /**
   * Retrieves general information about client.
   */
  get clientGeneralForm() {
    return this.clientGeneralStep.createClientForm;
  }

  /**
   * Retrieves the client object
   */
  get client() {
    if (this.clientTemplate.isAddressEnabled) {
      return {
        ...this.clientGeneralStep.clientGeneralDetails,
        ...this.clientFamilyMembersStep.familyMembers,
        ...this.clientAddressStep.address
      };
    } else {
      return {
        ...this.clientGeneralStep.clientGeneralDetails,
        ...this.clientFamilyMembersStep.familyMembers
      };
    }
  }
  /**
   * Submits the create client form.
   */
  submit() {
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    // TODO: Update once language and date settings are setup
    const clientData = {
      ...this.client,
      dateFormat,
      locale
    };
    this.clientsService.createClient(clientData).subscribe((response: any) => {
      this.router.navigate(['../', response.resourceId], { relativeTo: this.route });
    });
  }

}
