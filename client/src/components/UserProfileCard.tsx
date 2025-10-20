import { useState } from "react";
import { Edit2, Facebook, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserProfileCardProps {
  name: string;
  email: string;
  avatar?: string;
  facebookLinked?: boolean;
  onEdit?: () => void;
  onLinkFacebook?: () => void;
  onShare?: () => void;
}

export default function UserProfileCard({
  name,
  email,
  avatar,
  facebookLinked = false,
  onEdit,
  onLinkFacebook,
  onShare,
}: UserProfileCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="hover-elevate" data-testid="card-user-profile">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <h3 className="text-lg font-semibold">Profile</h3>
        <Button
          size="icon"
          variant="ghost"
          onClick={onEdit}
          data-testid="button-edit-profile"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16" data-testid="avatar-user">
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h4 className="font-semibold" data-testid="text-user-name">
              {name}
            </h4>
            <p className="text-sm text-muted-foreground" data-testid="text-user-email">
              {email}
            </p>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex items-center gap-2">
            <Facebook className="h-4 w-4 text-muted-foreground" />
            {facebookLinked ? (
              <Badge variant="secondary" data-testid="badge-facebook-linked">
                Facebook Connected
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onLinkFacebook}
                data-testid="button-link-facebook"
              >
                Link Facebook
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={onShare}
            data-testid="button-share-lists"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Shopping Lists
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
