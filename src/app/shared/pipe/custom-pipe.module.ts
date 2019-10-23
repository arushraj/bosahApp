import { NgModule, ModuleWithProviders } from '@angular/core';
import { BlankValuePipe, ImageBinderPipe, EventImageBinderPipe } from './custom-pipe';

@NgModule({
    imports: [
        // dep modules
    ],
    declarations: [
        BlankValuePipe,
        ImageBinderPipe,
        EventImageBinderPipe
    ],
    exports: [
        BlankValuePipe,
        ImageBinderPipe,
        EventImageBinderPipe
    ]
})
export class CustomPipesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CustomPipesModule
        };
    }
}
