//
//  AppDelegate.h
//  BulkRecorder
//
//  Created by Hongli Lai on 3/20/2013.
//  Copyright (c) 2013 Phusion. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "UKSoundFileRecorder.h"

@interface AppDelegate : NSObject <NSApplicationDelegate, NSTextFieldDelegate>
{
    enum {
        WAITING_FOR_RECORD,
        RECORDING,
        STOPPING_RECORDING
    } state;
    UKSoundFileRecorder *recorder;
}

@property (assign, nonatomic) IBOutlet NSWindow *window;
@property (assign, nonatomic) IBOutlet NSTextField *nameField;
@property (assign, nonatomic) IBOutlet NSButton *recordButton;
@property (assign, nonatomic) IBOutlet NSButton *stopButton;

- (IBAction)nameFieldActivated:(id)sender;
- (IBAction)recordButtonClicked:(id)sender;
- (IBAction)stopButtonClicked:(id)sender;

@end
